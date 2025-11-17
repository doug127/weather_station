/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('dashboard', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }, 
    sensor_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'sensors',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    position: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    chart_mode: {
      type: Sequelize.ENUM('multi', 'single', 'select'),
      allowNull: false,
      defaultValue: 'single'
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });
}

export const down = async (queryInterface) => {
  await queryInterface.dropTable('dashboard');
};