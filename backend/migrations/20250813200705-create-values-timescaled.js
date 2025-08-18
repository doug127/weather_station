/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('values_timescaled', {
    timestamp: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    value: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    sensor_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'sensors',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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

  await queryInterface.addConstraint('values_timescaled', {
    fields: ['timestamp', 'sensor_id'],
    type: 'unique',
    name: 'unique_timestamp_sensor'
  });

  await queryInterface.sequelize.query(`
    SELECT create_hypertable('values_timescaled', 'timestamp', if_not_exists => TRUE);
  `);
};

export const down = async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('values_timescaled');
};