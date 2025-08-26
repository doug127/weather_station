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
      description: `El anemómetro es un instrumento de medición diseñado para cuantificar la velocidad del viento. Su nombre proviene del griego ánemos, que significa "viento", y metron, que significa "medida", lo que directamente lo define como un medidor de viento. Es un dispositivo esencial en una variedad de campos, desde la meteorología y la aviación hasta la agricultura y la construcción. Su función principal es recopilar datos precisos sobre la fuerza y, en algunos casos, la dirección del movimiento del aire. Estos datos son cruciales para el pronóstico del tiempo, la seguridad en la navegación aérea y marítima, la evaluación del potencial eólico para la generación de energía, y el monitoreo de las condiciones ambientales en proyectos de ingeniería.

El anemómetro cumple la función vital de convertir el flujo de aire en una señal medible. Dependiendo del tipo, esta conversión puede ser mecánica, térmica o ultrasónica. El tipo más común y reconocible es el anemómetro de cazoletas , que consiste en tres o cuatro cazoletas hemisféricas montadas en brazos horizontales que giran alrededor de un eje vertical. La fuerza del viento empuja las cazoletas, haciendo que el conjunto rote. La velocidad de rotación es directamente proporcional a la velocidad del viento, y un contador electrónico o mecánico traduce esta rotación en una lectura de velocidad. Otro tipo es el anemómetro de hélice, que se asemeja a un molino de viento y también mide la velocidad del viento a través de la rotación de sus aspas. Para aplicaciones más avanzadas o donde se requiere una mayor precisión sin partes móviles, se utilizan los anemómetros de hilo caliente y los anemómetros ultrasónicos. El primero mide la velocidad del viento basándose en el efecto de enfriamiento del aire sobre un hilo o sonda calentada eléctricamente. El segundo utiliza ondas sonoras para determinar la velocidad del viento. Al enviar pulsos ultrasónicos entre transductores, el tiempo que tardan las ondas en viajar se ve afectado por el movimiento del aire. La diferencia en el tiempo de viaje de los pulsos en diferentes direcciones permite calcular con gran precisión la velocidad y la dirección del viento.

El anemómetro mide principalmente la variable física conocida como velocidad del viento. Esta variable se define como la rapidez con la que las masas de aire se desplazan de un lugar a otro. Es una magnitud vectorial que tiene tanto una magnitud (la velocidad en sí misma) como una dirección. Sin embargo, muchos anemómetros básicos solo miden la magnitud de esta velocidad. La velocidad del viento es un indicador clave de las condiciones atmosféricas. Una velocidad alta del viento, por ejemplo, puede indicar la presencia de un sistema de baja presión, una tormenta o un frente de aire frío. Por el contrario, una baja velocidad del viento o la calma pueden indicar la proximidad de un anticiclón o un sistema de alta presión. Su medición es fundamental para el pronóstico del tiempo, la planificación de vuelos, la seguridad en actividades al aire libre y la evaluación del riesgo de desastres naturales como incendios forestales.

La velocidad del viento se expresa en diversas unidades de medida, siendo el kilómetro por hora (km/h) una de las más comunes para el uso cotidiano y en pronósticos meteorológicos en muchas partes del mundo. Un kilómetro por hora representa que una masa de aire se mueve lo suficiente rápido como para cubrir una distancia de un kilómetro en una hora. Esta unidad es intuitiva y fácil de entender para la mayoría de las personas. Sin embargo, en contextos más técnicos y científicos, se utilizan otras unidades. El metro por segundo (m/s) es la unidad estándar en el Sistema Internacional de Unidades (SI). Es particularmente útil en cálculos científicos y de ingeniería. Por ejemplo, una velocidad de 1 m/s significa que el aire se mueve 1 metro cada segundo. Otras unidades importantes incluyen las millas por hora (mph), utilizadas en países como Estados Unidos y el Reino Unido, y los nudos (kt), que son la unidad de medida preferida en la navegación marítima y la aviación. Un nudo equivale a una milla náutica por hora, lo que representa aproximadamente 1.852 km/h. La escala de Beaufort también se utiliza para describir la velocidad del viento, aunque es más una escala descriptiva que una unidad de medida. Clasifica la fuerza del viento en 13 niveles (0 a 12) basándose en los efectos observables del viento sobre la superficie del mar o la tierra.`
    },
    {
      name: 'Barómetro',
      code: 'pres',
      serial: 'serial-barometro',
      variable: 'Presión atmosférica',
      description:`El barómetro es un instrumento fundamental para la medición de la presión atmosférica, una variable meteorológica clave que desempeña un papel crucial en la comprensión de la atmósfera terrestre y en la predicción del tiempo. El término "barómetro" proviene del griego baros que significa "peso" o "presión" y metron que significa "medida", lo que subraya su propósito de medir el "peso" del aire. Este sensor es indispensable en campos tan variados como la meteorología, la aviación, la navegación y la climatología, proporcionando datos esenciales para la seguridad y la investigación.

La función principal del barómetro es la de cuantificar la presión que ejerce la columna de aire que se encuentra sobre un punto específico de la superficie terrestre. Este "peso" del aire no es constante; fluctúa en función de la temperatura, la altitud y la presencia de sistemas meteorológicos como anticiclones y depresiones. La lectura de la presión barométrica permite a los meteorólogos identificar la llegada de frentes de aire, predecir cambios en las condiciones climáticas y monitorear la evolución de tormentas. Un aumento en la presión suele asociarse con la llegada de tiempo soleado y estable, mientras que un descenso indica la aproximación de un sistema de baja presión, que a menudo trae consigo precipitaciones, vientos fuertes y cielos nublados.

Existen varios tipos de barómetros, cada uno con un mecanismo de funcionamiento distinto. El barómetro de mercurio es el diseño original, inventado por Evangelista Torricelli en 1643. Consiste en un tubo de vidrio cerrado en un extremo e invertido en un recipiente de mercurio. La presión atmosférica ejerce fuerza sobre el mercurio en el recipiente, empujándolo hacia arriba dentro del tubo. La altura de la columna de mercurio es directamente proporcional a la presión atmosférica, y esta altura se mide para obtener la lectura. El barómetro aneroide, un tipo más moderno y común, no utiliza líquido. En cambio, se basa en una cápsula metálica sellada y flexible, de la cual se ha extraído la mayor parte del aire, creando un vacío parcial. Los cambios en la presión atmosférica hacen que la cápsula se expanda o contraiga. Estos pequeños movimientos se magnifican mediante un sistema de palancas y engranajes que mueve una aguja sobre una escala graduada, proporcionando una lectura de la presión.  En la actualidad, los barómetros digitales o electrónicos han ganado popularidad. Estos sensores utilizan una membrana de silicio o un transductor que mide la deflexión causada por la presión del aire y la convierte en una señal eléctrica que se interpreta como una lectura digital.

La variable que mide el barómetro es la presión atmosférica, definida como la fuerza por unidad de área ejercida por el peso del aire sobre la superficie de la Tierra. Esta presión se origina en la atracción gravitacional de la Tierra sobre las moléculas de aire en la atmósfera. Aunque el aire es invisible y su peso es ligero en pequeñas cantidades, la columna total de aire que se extiende desde la superficie hasta el límite superior de la atmósfera tiene un peso considerable. La presión atmosférica media a nivel del mar se considera de aproximadamente 1013.25 hectopascales (hPa). Es importante señalar que la presión atmosférica disminuye con la altitud, ya que la columna de aire sobre un punto es más corta. Por cada 10 metros de ascenso, la presión disminuye aproximadamente 1.2 hPa, un hecho que tiene implicaciones importantes para la aviación y el montañismo.

Las unidades de medida de la presión atmosférica son variadas, aunque el hectopascal (hPa) es la unidad más utilizada en la meteorología moderna. Un hectopascal es equivalente a 100 pascales. El pascal (Pa) es la unidad de presión del Sistema Internacional de Unidades (SI), definido como un newton por metro cuadrado (

1N/m 
2
 
). El hPa es preferido por su comodidad, ya que un hPa es numéricamente igual a un milibar (mb), una unidad que fue ampliamente utilizada en el pasado. Los milibares todavía se usan en ciertos contextos, particularmente en la aviación y la navegación. Por lo tanto, 1013 hPa es lo mismo que 1013 mb. Otras unidades de medida incluyen las pulgadas de mercurio (inHg), comunes en Estados Unidos, y los milímetros de mercurio (mmHg), utilizados en el campo de la medicina y en algunas aplicaciones científicas. Una presión de 1013.25 hPa equivale a 29.92 inHg o 760 mmHg. La elección de la unidad depende en gran medida de la región geográfica y del campo de aplicación.`
    },
    {
      name: 'Pluviómetro',
      code: 'prcp',
      serial: 'serial-pluviometro',
      variable: 'Precipitación',
      description: `El pluviómetro es un instrumento meteorológico fundamental diseñado específicamente para medir la cantidad de precipitación líquida, como la lluvia, que ha caído en un lugar y período de tiempo determinados. Su función esencial es capturar y cuantificar la precipitación que alcanza la superficie terrestre, proporcionando un dato crucial para el estudio del clima, la hidrología y la agricultura. A diferencia de otros sensores que miden variables en un instante, el pluviómetro acumula la precipitación a lo largo del tiempo, ofreciendo una medida de la cantidad total caída. Se utiliza ampliamente en estaciones meteorológicas, granjas, aeropuertos y proyectos de ingeniería civil para el monitoreo y la gestión de los recursos hídricos, la prevención de inundaciones y la planificación de cultivos.

La función principal que cumple un pluviómetro es la de actuar como un receptáculo estandarizado que mide con precisión la altura de una capa de agua, asumiendo que el terreno es una superficie plana y horizontal. Existen varios tipos de pluviómetros, cada uno con un mecanismo de funcionamiento particular. El más simple y tradicional es el pluviómetro estándar o de tipo manual, que consiste en un embudo receptor que conduce el agua de lluvia a un recipiente de medición graduado.  La cantidad de lluvia se determina visualmente midiendo la altura del agua acumulada en el recipiente. Por otro lado, los pluviómetros de balancín o basculantes son un tipo de pluviómetro automático y son muy comunes en las estaciones meteorológicas automatizadas. Estos cuentan con un embudo que dirige el agua hacia una pequeña cubeta con forma de balancín. Cuando la cubeta se llena con una cantidad predeterminada de agua (por ejemplo, 0.2 mm o 0.01 pulgadas de precipitación), se inclina para vaciarse y activar un interruptor que envía un pulso eléctrico. La cantidad de precipitación se calcula contando el número de pulsos recibidos en un período de tiempo. Los pluviómetros de peso son los más precisos; utilizan una plataforma de pesaje que mide el peso de la precipitación acumulada en un recipiente. Un sensor de peso registra la masa y la convierte en una lectura de altura de precipitación, ofreciendo una alta precisión y la capacidad de medir tanto lluvia como nieve.

El principal dato que mide un pluviómetro es la precipitación, que se refiere a cualquier forma de agua que cae desde la atmósfera a la superficie de la Tierra. Esta variable incluye lluvia, llovizna, nieve, aguanieve y granizo. La precipitación es un componente vital del ciclo del agua y un factor determinante en los patrones climáticos globales y locales. La medición de la precipitación es fundamental para la predicción meteorológica, el control de la sequía, la gestión de cuencas hidrográficas y el estudio del cambio climático. Por ejemplo, el monitoreo a largo plazo de los datos de precipitación permite a los científicos identificar tendencias climáticas, mientras que los datos en tiempo real son esenciales para emitir alertas de inundación. La cantidad de precipitación se mide como la profundidad que el agua de lluvia alcanzaría si se acumulara sobre una superficie plana y sin infiltración, es decir, es una medida de altura, no de volumen.

La unidad de medida más común para la precipitación es el milímetro (mm), que se ha adoptado globalmente en el campo de la meteorología. Un milímetro de precipitación significa que, si el agua de lluvia se extendiera uniformemente sobre una superficie, tendría una profundidad de un milímetro. Por ejemplo, si un pluviómetro registra 10 mm de lluvia, esto implica que 10 litros de agua han caído por cada metro cuadrado de superficie. Este sistema es intuitivo y fácil de entender, ya que la profundidad es una medida directa y la equivalencia entre el área y el volumen de agua caída es sencilla. Aunque el milímetro es la unidad estándar, también se utilizan otros sistemas de medida, especialmente en países angloparlantes, donde las pulgadas (in) son comunes. Una pulgada de lluvia equivale a 25.4 mm. En un contexto menos formal, también se pueden ver mediciones en centímetros (cm), donde 1 cm es igual a 10 mm. La uniformidad en el uso del milímetro en la comunidad científica y en las redes meteorológicas a nivel mundial facilita la comparación de datos y la colaboración en estudios climáticos transnacionales. La precisión en la medición de esta variable es crucial, ya que un pequeño error puede llevar a grandes inexactitudes en la evaluación de los recursos hídricos o en la predicción de fenómenos meteorológicos extremos.`
    },
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
      description: `El sensor de temperatura es un dispositivo electrónico o mecánico diseñado para medir y detectar el grado de calor o frío de un objeto, un gas, un líquido o un entorno. Es uno de los sensores más ubicuos y esenciales en el mundo de la electrónica y la automatización, con aplicaciones que van desde termostatos domésticos y hornos industriales hasta sistemas de monitoreo médico y control de procesos en la industria química. Su nombre, derivado del latín temperatura que significa "mezcla" o "equilibrio", refleja su función de medir una propiedad física que describe el estado de equilibrio térmico.

La función principal de un sensor de temperatura es convertir la energía térmica en una señal medible, ya sea eléctrica, mecánica o visual. La mayoría de los sensores modernos operan bajo un principio de transducción, donde un cambio en la temperatura provoca un cambio predecible en una propiedad física del sensor, como la resistencia, el voltaje o la longitud. Por ejemplo, los termistores son resistencias cuya resistencia eléctrica varía significativamente con la temperatura. Los termopares consisten en dos metales diferentes unidos en sus extremos; un cambio de temperatura en la unión genera un pequeño voltaje que puede ser medido. Los sensores de temperatura de resistencia (RTD), como los de platino, tienen una resistencia que aumenta de manera muy precisa y lineal con la temperatura. Finalmente, los sensores de temperatura de circuito integrado (CI), como los de la serie LM35, producen un voltaje de salida que es directamente proporcional a la temperatura en grados Celsius, lo que simplifica su uso en sistemas electrónicos.

El sensor de temperatura mide la variable física conocida como temperatura. Esta es una medida de la energía cinética promedio de las partículas (átomos o moléculas) en una sustancia. En términos más simples, la temperatura indica qué tan "caliente" o "frío" está algo. La temperatura es una variable intensiva, lo que significa que no depende de la cantidad de material presente, a diferencia de la energía térmica total (que es una variable extensiva). Es una variable fundamental en la física, la química y la biología, ya que influye en la velocidad de las reacciones químicas, el estado de la materia (sólido, líquido, gas) y la viabilidad de los organismos vivos. Su medición es vital para el control de calidad en la fabricación, la seguridad en la manipulación de alimentos y productos farmacéuticos, y el monitoreo de la salud humana.

Las unidades de medida para la temperatura son variadas, aunque el grado Celsius (°C) es una de las más utilizadas a nivel mundial en el ámbito científico y cotidiano. La escala Celsius se define con el punto de congelación del agua a 0 °C y el punto de ebullición a 100 °C a la presión atmosférica estándar, lo que la hace intuitiva y fácil de entender. Sin embargo, en otros contextos se utilizan diferentes sistemas de medida. El grado Fahrenheit (°F) es el sistema preferido en los Estados Unidos, donde el punto de congelación del agua es 32 °F y el de ebullición es 212 °F. La conversión entre ambas escalas es una fórmula matemática sencilla. La tercera escala fundamental es el Kelvin (K), la unidad de temperatura en el Sistema Internacional de Unidades (SI). La escala Kelvin es una escala de temperatura absoluta, lo que significa que su punto cero, llamado "cero absoluto" (0 K), representa el estado en el que la energía cinética de las partículas es mínima. No hay temperaturas negativas en la escala Kelvin. El cero absoluto equivale a -273.15 °C. Esta escala es esencial en la ciencia y la ingeniería, especialmente en la termodinámica y la criogenia, ya que simplifica muchos cálculos físicos al eliminar la necesidad de valores negativos. La elección de la unidad de medida depende del contexto, pero la función del sensor, la de convertir la energía térmica en una señal cuantificable, sigue siendo la misma.`
    },
    // {
    //   name: 'Veleta',
    //   code: 'wdir',
    //   serial: 'serial-veleta',
    //   variable: 'Dirección del viento'
    // }
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