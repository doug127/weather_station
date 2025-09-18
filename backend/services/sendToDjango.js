import axios from "axios";
import { Sensor } from "../models/Sensor.js";
import { ValuesTimescaled } from "../models/ValuesTimescale.js";
import { getFilteredValuesData } from "../controllers/valuesTimescale.controller.js";

export const trainModel = async (req, res) => {
  try {
    // 1️⃣ Obtener datos filtrados desde la DB
    const filteredDataObj = await getFilteredValuesData(req.query);
    const sensorsData = filteredDataObj.data; // [{ code, values: [{timestamp, value}]}]

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
    ].sort();

    // 4️⃣ Construir formato EXACTO que Django espera (agrupado por timestamp)
    const jsonData = allTimestamps.map(timestamp => {
      return {
        timestamp,
        values: sensorsData.map(sensor => {
          const found = sensor.values.find(v => v.timestamp === timestamp);
          return {
            code: sensor.code,
            value: found ? found.value : null
          };
        }).filter(v => v.value !== null) // quitar nulos
      };
    }).filter(entry => entry.values.length > 0); // solo filas con al menos un valor

    // 5️⃣ Extraer targets (los códigos de sensores)
    const targets = sensors.map(s => s.code);

    
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const datetime =
      now.getFullYear() + '-' +
      pad(now.getMonth() + 1) + '-' +
      pad(now.getDate()) + '-' +
      pad(now.getHours()) + '-' +
      pad(now.getMinutes()) + '-' +
      pad(now.getSeconds());

    const model_name = `predictor_${datetime}`;

    // 6️⃣ Payload final para Django
    const payload = {
      model_name: model_name,
      targets,
      json_data: jsonData
    };

    console.log("🚀 Payload enviado a Django:");
    console.log(JSON.stringify(payload, null, 2));

    console.log("📊 Resumen de datos a enviar:");
    console.log("   - Model name:", model_name);
    console.log("   - Cantidad de timestamps (filas):", jsonData.length);
    console.log("   - Cantidad de sensores (targets):", targets.length);
    console.log("   - Total de puntos de datos:", jsonData.reduce((sum, row) => sum + row.values.length, 0));

    jsonData.slice(0, 5).forEach((row, idx) => {
      console.log(`   [${idx}] timestamp=${row.timestamp}, values=${row.values.length}`);
    });

    // 7️⃣ Enviar request a Django
    const djangoRes = await axios.post(
      "http://localhost:8000/api/train-model/",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return res.json({
      message: "Modelo entrenado exitosamente",
      django_response: djangoRes.data,
      payload_summary: {
        rows_count: jsonData.length, // cantidad de timestamps enviados
        targets_count: targets.length,
        total_data_points: jsonData.reduce((sum, row) => sum + row.values.length, 0)
      }
    });

  } catch (error) {
    console.error("❌ Error enviando datos a Django:", error);

    if (error.response) {
      console.error("Django response error:", error.response.data);
      return res.status(error.response.status).json({
        message: "Error en Django al entrenar modelo",
        error: error.response.data
      });
    }

    return res.status(500).json({
      message: "Error al entrenar el modelo desde Node",
      error: error.message
    });
  }
};


export const predictWeather = async (req, res) => {
  try {
    console.log("🔍 Node recibió body:", JSON.stringify(req.body, null, 2));

    // 1️⃣ Validar que venga el campo `data`
    let payload;
    if (req.body && Array.isArray(req.body.data)) {
      // Si ya viene en el formato correcto, usarlo directo
      payload = req.body;
    } else {
      // Si viene en crudo (ej: un objeto con las features), lo envolvemos en `data: [ ... ]`
      payload = {
        data: [req.body]
      };
    }

    console.log("📤 Enviando a Django:", JSON.stringify(payload, null, 2));

    // 2️⃣ Enviar al endpoint de Django
    const djangoRes = await axios.post(
      "http://localhost:8000/api/predict-model/",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    // 3️⃣ Retornar resultado a cliente
    return res.json({
      message: "Predicción generada y almacenada en Django",
      predictions: djangoRes.data
    });

  } catch (error) {
    console.error("❌ Error enviando datos a Django:", error.message);
    console.error("❌ Django respondió:", error.response?.data);
    
    return res.status(error.response?.status || 500).json({
      message: "Error al predecir desde Node",
      error: error.response?.data || error.message
    });
  }
};

export const trainAndPredictFromDb = async (req, res) => {
  try {
    // 0️⃣ Recibir timestamp desde body (ISO expected)
    const { timestamp } = req.body;
    if (!timestamp) {
      return res.status(400).json({ message: "timestamp es requerido en el body (ISO string)." });
    }

    // 1️⃣ Obtener datos filtrados desde la DB (reusa tu función)
    // Su función getFilteredValuesData antes usaba req.query; aquí le pasamos un objeto con timestamp
    const filteredDataObj = await getFilteredValuesData({ timestamp });
    const sensorsData = filteredDataObj.data; // [{ code, values: [{timestamp, value}]}]

    if (!sensorsData || sensorsData.length === 0) {
      return res.status(400).json({ message: "No hay datos de sensores disponibles para el timestamp indicado." });
    }

    // 2️⃣ Mapear sensor_code a sensor_id real desde la DB (opcional, solo para targets)
    const sensorCodes = sensorsData.map(s => s.code);
    const sensors = await Sensor.findAll({
      where: { code: sensorCodes },
      attributes: ['id', 'code']
    });

    if (!sensors || sensors.length === 0) {
      return res.status(400).json({ message: "No se encontraron sensores en la DB con los códigos obtenidos." });
    }

    // 3️⃣ Obtener todos los timestamps únicos (ordenados)
    const allTimestamps = [
      ...new Set(sensorsData.flatMap(sensor => sensor.values.map(v => v.timestamp)))
    ].sort();

    // 4️⃣ Construir formato EXACTO que Django espera (agrupado por timestamp)
    const jsonData = allTimestamps.map(ts => {
      return {
        timestamp: ts,
        values: sensorsData.map(sensor => {
          const found = sensor.values.find(v => v.timestamp === ts);
          return {
            code: sensor.code,
            value: found ? found.value : null
          };
        }).filter(v => v.value !== null)
      };
    }).filter(entry => entry.values.length > 0);

    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({ message: "No hay filas válidas (json_data vacío) para enviar a entrenamiento." });
    }

    // 5️⃣ Targets (códigos)
    const targets = sensors.map(s => s.code);

    // 6️⃣ Generar model_name único
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const datetime =
      now.getFullYear() + '-' +
      pad(now.getMonth() + 1) + '-' +
      pad(now.getDate()) + '-' +
      pad(now.getHours()) + '-' +
      pad(now.getMinutes()) + '-' +
      pad(now.getSeconds());
    const model_name = `predictor_${datetime}`;

    // 7️⃣ Payload final para Django
    const trainPayload = {
      model_name,
      targets,
      json_data: jsonData
    };

    // 8️⃣ Logs detallados
    console.log("🚀 [trainAndPredictFromDb] Payload a Django (preview):");
    console.log(JSON.stringify(trainPayload.json_data[0], null, 2));
    console.log("📊 Resumen de datos a enviar:");
    console.log("   - Model name:", model_name);
    console.log("   - Cantidad de timestamps (filas):", jsonData.length);
    console.log("   - Cantidad de sensores (targets):", targets.length);
    console.log("   - Total de puntos de datos:", jsonData.reduce((sum, row) => sum + row.values.length, 0));
    jsonData.slice(0, 5).forEach((row, idx) => {
      console.log(`   [${idx}] timestamp=${row.timestamp}, values=${row.values.length}`);
    });

    // 9️⃣ Enviar request a Django para entrenar
    let djangoTrainResponse = null;
    try {
      djangoTrainResponse = await axios.post(
        "http://localhost:8000/api/train-model/",
        trainPayload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ Entrenamiento OK:", djangoTrainResponse.data);
    } catch (trainErr) {
      console.error("❌ Error entrenando en Django:", trainErr.response?.data || trainErr.message);
      // No hacemos return inmediato: intentaremos predecir si es posible (fallback)
    }

    // 10️⃣ Preparar payload para predicción: intentar usar la fila exacta del timestamp indicado
    // Si no existe, usar la última fila disponible.
    let selectedRow = jsonData.find(r => r.timestamp === timestamp);
    if (!selectedRow) {
      selectedRow = jsonData[jsonData.length - 1];
      console.warn(`[trainAndPredictFromDb] No se encontró fila exacta para timestamp ${timestamp}. Usando última fila: ${selectedRow.timestamp}`);
    }

    const predictFeatures = {};
    selectedRow.values.forEach(v => {
      predictFeatures[v.code] = v.value;
    });

    const predictPayload = { data: [predictFeatures] };
    console.log("🔮 Payload de predicción a Django:", JSON.stringify(predictPayload, null, 2));

    // 11️⃣ Enviar request a Django para predecir
    let djangoPredictResponse = null;
    try {
      const pdRes = await axios.post(
        "http://localhost:8000/api/predict-model/",
        predictPayload,
        { headers: { "Content-Type": "application/json" } }
      );
      djangoPredictResponse = pdRes;
      console.log("✅ Predicción OK:", pdRes.data);
    } catch (predictErr) {
      console.error("❌ Error al predecir en Django:", predictErr.response?.data || predictErr.message);
      // Si el entrenamiento falló y la predicción también, devolvemos el error del backend predict si existe
      if (!djangoTrainResponse) {
        return res.status(predictErr.response?.status || 500).json({
          message: "Fallo el entrenamiento y la predicción",
          train_error: trainErr?.response?.data || trainErr?.message,
          predict_error: predictErr?.response?.data || predictErr?.message
        });
      }

      // Si el entrenamiento fue OK pero la predicción falló, devolvemos resumen y el error de predicción
      return res.status(predictErr.response?.status || 500).json({
        message: "Entrenamiento completado pero la predicción falló",
        train_response: djangoTrainResponse?.data,
        predict_error: predictErr.response?.data || predictErr.message
      });
    }

    // 12️⃣ Todo OK: devolver resumen
    return res.json({
      message: "Entrenamiento y predicción completados (o predicción realizada con último modelo disponible).",
      payload_summary: {
        rows_count: jsonData.length,
        targets_count: targets.length,
        total_data_points: jsonData.reduce((sum, row) => sum + row.values.length, 0),
        used_timestamp_for_prediction: selectedRow.timestamp
      },
      train_response: djangoTrainResponse?.data ?? null,
      predict_response: djangoPredictResponse?.data ?? null
    });

  } catch (error) {
    console.error("❌ Error en trainAndPredictFromDb:", error);
    if (error.response) {
      return res.status(error.response.status).json({
        message: "Error al procesar request en Node",
        error: error.response.data
      });
    }
    return res.status(500).json({
      message: "Error interno en trainAndPredictFromDb",
      error: error.message
    });
  }
};