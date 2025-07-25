/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  const [variables] = await queryInterface.sequelize.query(
    `SELECT id, name FROM "variables";`
  );

  const variableMap = {};
  variables.forEach(v => {
    variableMap[v.name] = v.id;
  });

  const sensorsData = [
    {
      name: 'Anemómetro',
      code: 'wspd',
      serial: 'serial-anemometro',
      variable: 'Velocidad del viento', 
    },
    {
      name: 'Barómetro',
      code: 'pres',
      serial: 'serial-barometro',
      variable: 'Presión atmosférica'
    },
    {
      name: 'Pluviómetro',
      code: 'prcp',
      serial: 'serial-pluviometro',
      variable: 'Precipitación'
    },
    {
      name: 'Sensor Temperatura Máxima',
      code: 'tmax',
      serial: 'serial-temp',
      variable: 'Temperatura'
    },
    {
      name: 'Sensor Temperatura Mínima',
      code: 'tmin',
      serial: 'serial-temp',
      variable: 'Temperatura'
    },
    {
      name: 'Sensor Temperatura Promedio',
      code: 'tavg',
      serial: 'serial-temp',
      variable: 'Temperatura'
    },
    {
      name: 'Veleta',
      code: 'wdir',
      serial: 'serial-veleta',
      variable: 'Dirección del viento'
    }
  ];

  const sensors = sensorsData.map(({ variable, ...rest }) => ({
    ...rest,
    variableId: variableMap[variable],
    createdAt: now,
    updatedAt: now
  }));


  await queryInterface.bulkInsert('sensors', sensors, {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('sensors', null, {});
  await queryInterface.sequelize.query(`ALTER SEQUENCE "sensors_id_seq" RESTART WITH 1;`);

}