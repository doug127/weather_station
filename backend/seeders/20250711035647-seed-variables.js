/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */

export async function up(queryInterface, Sequelize) {
  const variablesData = [
    ['Temperatura', '°C', -80, 70],
    ['Precipitación', 'mm', 0, 100],
    ['Insolación', 'horas', 0, 24],
    ['Dirección del viento', '°', 0 , 360],
    ['Velocidad del viento', 'km/h', 0, 150],
    ['Humedad relativa', '%', 0, 100],
    ['Radiación solar', 'W/m²', 0, 1361],
    ['Presión atmosférica', 'hPa', 100, 1100],
    ['Evaporación', 'mm', 0, 100],
  ];

  await queryInterface.bulkInsert('variables',
    variablesData.map(([name, unit, min, max]) => ({
      name,
      unit,
      min,
      max,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('variables', null, {});
  await queryInterface.sequelize.query(`ALTER SEQUENCE "variables_id_seq" RESTART WITH 1;`);
}
