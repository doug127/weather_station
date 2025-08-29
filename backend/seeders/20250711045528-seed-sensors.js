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
      description: `El anemómetro es un instrumento fundamental en el campo de la meteorología y la climatología, diseñado para medir la velocidad del viento. Su función principal es cuantificar el movimiento horizontal del aire, proporcionando datos esenciales para pronósticos del tiempo, estudios climáticos, y operaciones en áreas como la aviación, la agricultura y la ingeniería civil. Los datos que mide son la velocidad del viento, típicamente expresada en kilómetros por hora (km/h), metros por segundo (m/s) o nudos. La velocidad del viento es una variable crucial que representa la rapidez con la que se desplazan las masas de aire en la atmósfera.  Esta variable es vital para entender los patrones climáticos y predecir fenómenos meteorológicos. La unidad de medida km/h (kilómetros por hora) es una de las más comunes para expresar esta velocidad. Un kilómetro por hora indica que, si el viento mantuviera esa velocidad constante, recorrería una distancia de un kilómetro en el transcurso de una hora. Esta unidad es ampliamente utilizada por su facilidad de comprensión en contextos cotidianos y reportes meteorológicos, facilitando la interpretación de los datos medidos por el anemómetro.`
    },
    {
      name: 'Barómetro',
      code: 'pres',
      serial: 'serial-barometro',
      variable: 'Presión atmosférica',
      description: `El barómetro es un sensor esencial utilizado para medir la presión atmosférica. Su función principal es cuantificar el peso que ejerce la columna de aire sobre un punto específico de la superficie terrestre. Esta medición es crucial en campos como la meteorología, la climatología y la aviación, ya que los cambios en la presión atmosférica son un indicador clave de las variaciones del clima. Por ejemplo, una caída brusca de la presión suele preceder a una tormenta, mientras que un aumento indica la llegada de buen tiempo.  El barómetro mide la variable de la presión atmosférica, que se define como la fuerza por unidad de área ejercida por el aire. La unidad de medida empleada comúnmente en este contexto es el hectopascal (hPa). Un hectopascal equivale a 100 pascales. Esta unidad es preferida en meteorología a nivel global por su facilidad de uso, reemplazando a la antigua unidad de milibares (mb), con la cual mantiene una relación directa (1 hPa = 1 mb).`},
    {
      name: 'Pluviómetro',
      code: 'prcp',
      serial: 'serial-pluviometro',
      variable: 'Precipitación',
      description: `El pluviómetro es un instrumento de medición meteorológica que se utiliza para cuantificar la precipitación, que es la caída de agua de la atmósfera a la superficie de la Tierra, ya sea en forma de lluvia, nieve o granizo. Su función principal es recolectar y medir la cantidad de agua caída en un lugar y período de tiempo específicos. El pluviómetro mide la precipitación, que es la variable meteorológica que representa el volumen de agua acumulado. Esta variable es crucial para el estudio del clima, la gestión de recursos hídricos, la agricultura y la predicción de fenómenos como inundaciones. La unidad de medida para la precipitación es el milímetro (mm), que representa el espesor de la capa de agua que se acumularía en una superficie plana y horizontal, si no hubiera infiltración, evaporación o escorrentía. Es un sensor clave en las estaciones meteorológicas, proporcionando datos esenciales para el análisis hidrológico y climático.`},
    {
      name: 'Sensor Temperatura Máxima',
      code: 'tmax',
      serial: 'serial-temp',
      variable: 'Temperatura',
      description: null
    },
    {
      name: 'Sensor Temperatura Mínima',
      code: 'tmin',
      serial: 'serial-temp',
      variable: 'Temperatura',
      description: null
    },
    {
      name: 'Sensor Temperatura Promedio',
      code: 'tavg',
      serial: 'serial-temp',
      variable: 'Temperatura',
      description: `El sensor de temperatura es un dispositivo que permite medir la magnitud física de la temperatura, es decir, el grado de calor o frío que un objeto, un cuerpo o un entorno posee. Su función principal es convertir esta magnitud en una señal eléctrica que puede ser interpretada y procesada por otros dispositivos, como microcontroladores, termómetros digitales o sistemas de control industrial. Estos sensores son esenciales en diversas aplicaciones, desde la regulación de la climatización en hogares y edificios hasta el monitoreo de procesos industriales en plantas de manufactura. La variable que mide es la temperatura, que se define como la medida de la energía cinética promedio de las partículas en una sustancia. La unidad de medida para esta variable es el grado Celsius (°C), que es una escala termométrica ampliamente utilizada, donde 0 °C representa el punto de congelación del agua y 100 °C su punto de ebullición a presión atmosférica normal. Este sensor, por lo tanto, proporciona datos precisos que son fundamentales para la automatización y el control de sistemas donde la temperatura es un parámetro crítico.`
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