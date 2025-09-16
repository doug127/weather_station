import axios from "axios";
import { Sensor } from "../models/Sensor.js";
import { ValuesTimescaled } from "../models/ValuesTimescale.js";
import { getFilteredValuesData } from "../controllers/valuesTimescale.controller.js";

export const trainModel = async (req, res) => {
  try {
    // 1️⃣ Obtener los valores filtrados desde la DB
    const filteredDataObj = await getFilteredValuesData(req.query);
    const sensorsData = filteredDataObj.data; // array de sensores

    if (!sensorsData || sensorsData.length === 0) {
      return res.status(400).json({ message: "No hay datos de sensores disponibles." });
    }

    // 2️⃣ Mapear sensor_code a sensor_id real desde la DB
    const sensorCodes = sensorsData.map(s => s.code);
    const sensors = await Sensor.findAll({
      where: { code: sensorCodes },
      attributes: ['id', 'code']
    });

    if (!sensors || sensors.length === 0) {
      return res.status(400).json({ message: "No se encontraron sensores en la DB." });
    }

    // 3️⃣ Obtener todos los timestamps únicos
    const allTimestamps = [
      ...new Set(sensorsData.flatMap(sensor => sensor.values.map(v => v.timestamp)))
    ].sort(); // ordenar por fecha

    // 4️⃣ FORMATO CORRECTO: Agrupar por timestamp, no por sensor
    const dataFormatted = [];

    allTimestamps.forEach(timestamp => {
      const dataBlock = {
        code: timestamp, // Django usa esto como identificador
        values: []
      };

      // Para cada sensor, buscar el valor en este timestamp
      sensorsData.forEach(sensor => {
        const valueObj = sensor.values.find(v => v.timestamp === timestamp);
        
        if (valueObj && valueObj.value !== null) {
          dataBlock.values.push({
            timestamp: timestamp,
            value: valueObj.value
          });
        }
      });

      // Solo agregar si tiene al menos un valor no nulo
      if (dataBlock.values.length > 0) {
        dataFormatted.push(dataBlock);
      }
    });

    // Django espera: { "data": [{ "code": "sensor_code", "values": [...] }] }
    const djangoFormat = {
      data: sensorsData.map(sensor => ({
        code: sensor.code, // código del sensor
        values: sensor.values
          .filter(v => v.value !== null) // filtrar valores nulos
          .map(v => ({
            timestamp: v.timestamp,
            value: v.value
          }))
      })).filter(sensor => sensor.values.length > 0) // solo sensores con datos
    };

    // 6️⃣ Extraer targets (codes de sensores)
    const targets = sensors.map(s => s.code);

    // 7️⃣ Preparar payload EXACTAMENTE como Django espera
    const payload = {
      model_name: 'rain_predictor_from_node',
      json_data: djangoFormat, // 🔥 ESTE ES EL FORMATO CORRECTO
      targets
    };

    console.log("🚀 Payload corregido para Django:");
    // console.log("json_data sample:", JSON.stringify(djangoFormat.data.slice(0, 2), null, 2));
    console.log("targets:", targets);

    // 8️⃣ Enviar a Django
    const djangoRes = await axios.post(
      'http://localhost:8000/api/train-model/',
      payload,
      { 
        headers: { 'Content-Type': 'application/json' }
      }
    );

    return res.json({
      message: 'Modelo entrenado exitosamente',
      django_response: djangoRes.data,
      payload_summary: {
        sensors_count: djangoFormat.data.length,
        targets_count: targets.length,
        total_data_points: djangoFormat.data.reduce((sum, sensor) => sum + sensor.values.length, 0)
      }
    });

  } catch (error) {
    console.error('❌ Error enviando datos a Django:', error);
    
    // Mejor manejo de errores
    if (error.response) {
      console.error('Django response error:', error.response.data);
      return res.status(error.response.status).json({
        message: 'Error en Django al entrenar modelo',
        error: error.response.data
      });
    }
    
    return res.status(500).json({
      message: 'Error al entrenar el modelo desde Node',
      error: error.message
    });
  }
};





export const predictWeather = async (req, res) => {
  try {
    console.log("🔍 Node recibió body:", JSON.stringify(req.body, null, 2));
    
    // Django espera exactamente lo que React envía
    const payload = req.body; // No transformar, pasar directamente
    
    console.log("📤 Enviando a Django:", JSON.stringify(payload, null, 2));

    // Enviar a Django
    const djangoRes = await axios.post(
      'http://localhost:8000/api/predict-model/',
      payload, // Pasar directamente sin modificación
      { headers: { 'Content-Type': 'application/json' } }
    );

    return res.json({
      message: 'Predicción generada y almacenada en Django',
      predictions: djangoRes.data
    });
  } catch (error) {
    console.error('❌ Error enviando datos a Django:', error.message);
    console.error('❌ Error response:', error.response?.data);
    res.status(500).json({
      message: 'Error al predecir desde Node',
      error: error.response?.data || error.message
    });
  }
};