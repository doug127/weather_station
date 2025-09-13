import Swal from "sweetalert2";
import { api } from "@/shared/api/apiRoutes";

export const useSendValues = (formValues, selectedDate, selectedTime, resetForm, setLoading) => {
  const sendValues = async () => {
    // 1️⃣ Validaciones iniciales
    if (!selectedDate || !selectedTime) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor selecciona la hora y la fecha.",
      });
      return;
    }

    // Validar que se hayan ingresado valores
    if (!formValues || Object.keys(formValues).length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin valores",
        text: "Por favor ingresa al menos un valor de sensor.",
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: "¿Registrar valores?",
      text: "Se guardarán todos los datos ingresados, se entrenará el modelo y se generará una predicción.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, procesar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmResult.isConfirmed) return;

    const timestamp = new Date(`${selectedDate}T${selectedTime}:00Z`).toISOString();

    try {
      setLoading(true);

      // 1️⃣ Guardar valores en la DB
      const payload = {
        timestamp,
        values: Object.keys(formValues)
          .filter(sensorId => formValues[sensorId] !== '' && formValues[sensorId] != null)
          .map((sensorId) => ({
            sensor_id: parseInt(sensorId),
            value: parseFloat(formValues[sensorId]),
          })),
      };

      console.log("💾 Guardando valores:", payload);
      const response = await api.post("/value/create", payload);

      // 2️⃣ Entrenar modelo con TODOS los datos (incluyendo históricos)
      console.log("🧠 Iniciando entrenamiento del modelo...");
      const trainResponse = await api.post("/model/train-model", {
        // Parámetros para el filtrado de datos históricos (opcional)
        // startDate: "2021-01-01",
        // endDate: new Date().toISOString().split('T')[0]
      });

      console.log("✅ Modelo entrenado:", trainResponse.data);

      // 3️⃣ Preparar datos para predicción
      // Necesitamos mapear sensor_id a sensor_code para la predicción
      const sensorIds = Object.keys(formValues).map(id => parseInt(id));
      
      // Obtener los códigos de sensores
      console.log("📡 Obteniendo sensores...");
      const sensorsResponse = await api.get(`/sensor`);
      console.log("📡 Respuesta de sensores:", sensorsResponse.data);
      
      // Extraer el array de sensores de la estructura { message, total, data }
      const sensors = sensorsResponse.data.data; // Accede a la propiedad 'data' del objeto
      
      // Validar que sensors sea un array
      if (!Array.isArray(sensors)) {
        throw new Error(`Expected sensors array, got: ${typeof sensors}`);
      }
      
      console.log("🔍 Sensores procesados:", sensors.length, "sensores encontrados");
      
      // Crear mapping sensor_id -> code
      const idToCodeMap = {};
      sensors.forEach(sensor => {
        idToCodeMap[sensor.id] = sensor.code;
      });
      
      console.log("🗺️ Mapeo creado:", idToCodeMap);

      // 4️⃣ Crear payload de predicción con el formato correcto
      const predictionData = {};
      let mappedCount = 0;
      
      Object.keys(formValues).forEach(sensorId => {
        const sensorValue = formValues[sensorId];
        
        // Intentar mapear tanto con string como con número
        let sensorCode = idToCodeMap[sensorId] || idToCodeMap[parseInt(sensorId)];
        
        console.log(`🔍 Mapeo: sensor_id="${sensorId}" (${typeof sensorId}) -> code="${sensorCode}", value="${sensorValue}"`);
        
        if (sensorCode && sensorValue !== '' && sensorValue != null && sensorValue !== undefined) {
          predictionData[sensorCode] = parseFloat(sensorValue);
          mappedCount++;
          console.log(`✅ Mapeado exitoso: ${sensorCode} = ${sensorValue}`);
        } else {
          console.log(`❌ No mapeado: sensorCode=${sensorCode}, sensorValue=${sensorValue}`);
        }
      });

      console.log("📊 Datos mapeados:", predictionData);
      console.log("📈 Total mapeados:", mappedCount, "de", Object.keys(formValues).length);

      // Validar que se mapearon datos
      if (mappedCount === 0) {
        throw new Error("No se pudieron mapear los datos de sensores para la predicción");
      }

      const predictionPayload = {
        data: [predictionData] // Django espera array con un objeto
      };

      console.log("🔮 Generando predicción con payload:", JSON.stringify(predictionPayload, null, 2));

      // 5️⃣ Generar predicción
      const predictRes = await api.post("/model/predict-model", predictionPayload);

      console.log("📊 Predicción generada:", predictRes.data);

      setLoading(false);

      // 6️⃣ Mostrar resultado exitoso
      const prediction = predictRes.data?.predictions?.prediction?.prediction_value ?? "N/A";
      const modelUsed = predictRes.data?.predictions?.model_used ?? "Modelo desconocido";

      await Swal.fire({
        icon: "success",
        title: "¡Proceso completado!",
        html: `
          <div class="text-left">
            <p>✅ <strong>Valores guardados:</strong> ${payload.values.length} sensores</p>
            <p>🧠 <strong>Modelo entrenado:</strong> ${modelUsed}</p>
            <p>🔮 <strong>Predicción generada:</strong> ${prediction}</p>
            <hr class="my-2">
            <p><small>Los datos se han procesado correctamente en el sistema.</small></p>
          </div>
        `,
        confirmButtonText: "Aceptar",
        width: 500
      });

      resetForm();

    } catch (error) {
      setLoading(false);
      console.error("❌ Error en el flujo completo:", error);
      
      // Manejo detallado de errores
      let errorMessage = "Ocurrió un error durante el proceso.";
      let errorTitle = "Error en el flujo";
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        // Identificar en qué paso falló
        if (error.config?.url?.includes('/value/create')) {
          errorTitle = "Error al guardar valores";
        } else if (error.config?.url?.includes('/train-model')) {
          errorTitle = "Error al entrenar modelo";
        } else if (error.config?.url?.includes('/predict-model')) {
          errorTitle = "Error al generar predicción";
        }
      }

      await Swal.fire({
        icon: "error",
        title: errorTitle,
        text: errorMessage,
        footer: `<small>Detalles técnicos: ${error.message}</small>`
      });
    }
  };

  return { sendValues };
};



