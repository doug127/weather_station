
export const up = async (queryInterface, Sequelize) => {
  await queryInterface.bulkInsert('dashboard', [
    {
      sensor_id: 3,
      position: 1,
      is_active: true,
      chart_mode: 'single',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      sensor_id: 4,
      position: 2,
      is_active: true,
      chart_mode: 'multi',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      sensor_id: 5,
      position: 2,
      is_active: true,
      chart_mode: 'multi',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      sensor_id: 6,
      position: 2,
      is_active: true,
      chart_mode: 'multi',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      sensor_id: 1,
      position: 3,
      is_active: true,
      chart_mode: 'single',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      sensor_id: 2,
      position: 4,
      is_active: true,
      chart_mode: 'single',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
};
