import { Dashboard } from '../models/Dashboard.js';
import { Sensor } from '../models/Sensor.js';
import { Variable } from '../models/Variable.js';   
import { Op } from 'sequelize';
import { sequelize } from '../server/db.js';

export const getActiveDashboard = async (req, res) => {
    try {
      const dashboardItems = await Dashboard.findAll({
        where: { is_active: true },
        attributes: { exclude: ['sensor_id', 'createdAt', 'updatedAt']},
        include: [{
          model: Sensor,
          attributes: ['id', 'name'],
          include: [{
            model: Variable,
            attributes: ['name', 'unit']
          }]
        }],
        order: [['position', 'ASC']]
      });

      if (!dashboardItems || dashboardItems.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: 'No hay gráficos activos en el dashboard'
        });
      }

      return res.status(200).json({
        success: true,
        data: dashboardItems
      });

    } catch (error) {
      console.error('Error obteniendo los gráficos del dashboard:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener los gráficos del dashboard',
        error: error.message
      });
    }
  };

export const updateDashboardItem = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { sensor_id, position, is_active } = req.body;

    // Validar ID
    if (!id || isNaN(id)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const dashboardItem = await Dashboard.findByPk(id, { transaction });
    if (!dashboardItem) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Item del dashboard no encontrado'
      });
    }

    if (sensor_id !== undefined) {
      const sensorExists = await Sensor.findByPk(sensor_id);
      if (!sensorExists) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'El sensor especificado no existe'
        });
      }

      // Verificar duplicado
      const duplicate = await Dashboard.findOne({
        where: {
          sensor_id,
          id: { [Op.ne]: id }
        },
        transaction
      });

      if (duplicate) {
        await transaction.rollback();
        return res.status(409).json({
          success: false,
          message: 'Este sensor ya está en el dashboard'
        });
      }
    }

    // ✅ Validar position
    if (position !== undefined) {
      if (position < 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'La posición debe ser un número positivo'
        });
      }

      if (position !== dashboardItem.position) {
        const oldPosition = dashboardItem.position;
        
        if (position > oldPosition) {
          await Dashboard.decrement('position', {
            by: 1,
            where: {
              position: { [Op.gt]: oldPosition, [Op.lte]: position },
              id: { [Op.ne]: id }
            },
            transaction
          });
        } else {
          await Dashboard.increment('position', {
            by: 1,
            where: {
              position: { [Op.gte]: position, [Op.lt]: oldPosition },
              id: { [Op.ne]: id }
            },
            transaction
          });
        }
      }
    }

    // ✅ Actualizar el item
    const updateData = {};
    if (sensor_id !== undefined) updateData.sensor_id = sensor_id;
    if (position !== undefined) updateData.position = position;
    if (is_active !== undefined) updateData.is_active = is_active;

    await dashboardItem.update(updateData, { transaction });
    await transaction.commit(); // 💥 Se confirma aquí

    // Luego de commit, NO uses el mismo `transaction`
    const updatedItem = await Dashboard.findByPk(id, {
      include: [{
        model: Sensor,
        attributes: ['id', 'name']
      }]
    });

    return res.status(200).json({
      success: true,
      message: 'Item del dashboard actualizado exitosamente',
      data: updatedItem
    });

  } catch (error) {
    // ⚡ Asegurarse de solo hacer rollback si sigue activa
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    
    console.error('Error updating dashboard item:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el item del dashboard',
      error: error.message
    });
  }
};
