import Swal from "sweetalert2";
import { api } from "@/shared/api/apiRoutes";

export const useSendValues = (formValues, selectedDate, selectedTime, resetForm, setLoading, sensors) => {
  const sendValues = async (filteredValues) => { // Recibir valores ya filtrados
    if (!selectedDate || !selectedTime) {
      return Swal.fire({ 
        icon: "warning", 
        title: "Campos incompletos", 
        text: "Por favor selecciona la hora y la fecha." 
      });
    }

    if (!filteredValues || filteredValues.length === 0) {
      return Swal.fire({ 
        icon: "warning", 
        title: "Sin valores", 
        text: "Por favor ingresa al menos un valor de sensor válido." 
      });
    }

    const confirmResult = await Swal.fire({
      title: "¿Registrar valores?",
      text: "Se guardarán los datos, se entrenará el modelo y se generará una predicción.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, procesar",
      cancelButtonText: "Cancelar",
    });
    
    if (!confirmResult.isConfirmed) return;

    // Parsear fecha correctamente
    const [year, month, day] = selectedDate.split("-").map(Number);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const timestamp = date.toISOString();

    try {
      setLoading(true);

      // Crear mapa de sensor_id a code
      const sensorMap = {};
      sensors.forEach(s => {
        sensorMap[s.id] = s.code;
      });

      // 1️⃣ Guardar valores en la DB (usar filteredValues)
      const savePayload = {
        timestamp,
        values: filteredValues // Ya viene filtrado desde handleSendValues
      };

      console.log("💾 Guardando valores:", savePayload);
      await api.post("/value/create", savePayload);

      // 2️⃣ Entrenar modelo (usar filteredValues)
      const trainPayload = {
        model_name: "rain_predictor_from_node",
        targets: filteredValues.map(v => sensorMap[v.sensor_id] || v.sensor_id),
        json_data: [
          {
            timestamp,
            values: filteredValues.map(v => ({
              code: sensorMap[v.sensor_id] || v.sensor_id,
              value: v.value,
            })),
          },
        ],
      };

      console.log("🧠 Entrenando modelo con:", trainPayload);
      const trainResponse = await api.post("/model/train-model", trainPayload);
      console.log("✅ Modelo entrenado:", trainResponse.data);

      // 3️⃣ Generar predicción (usar filteredValues)
      const predictionPayload = {
        data: [
          filteredValues.reduce((acc, v) => {
            const code = sensorMap[v.sensor_id] || v.sensor_id;
            acc[code] = v.value;
            return acc;
          }, {}),
        ],
      };

      console.log("🔮 Payload de predicción:", predictionPayload);
      const predictRes = await api.post("/model/predict-model", predictionPayload);
      console.log("📊 Predicción generada:", predictRes.data);

      setLoading(false);

      await Swal.fire({
        icon: "success",
        title: "Proceso completado",
        html: `
          <div class="text-left">
            <p>✅ <strong>Valores guardados:</strong> ${filteredValues.length} sensores</p>
            <p>🧠 <strong>Modelo entrenado:</strong> ${predictRes.data.model_used}</p>
            <p>🔮 <strong>Predicciones:</strong> ${JSON.stringify(predictRes.data.predictions)}</p>
          </div>
        `,
        confirmButtonText: "Aceptar",
        width: 500,
      });

      resetForm();
    } catch (error) {
      setLoading(false);
      console.error("❌ Error en flujo:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      await Swal.fire({ 
        icon: "error", 
        title: "Error en el proceso", 
        text: errorMessage, 
        footer: `<small>Detalles: ${error.message}</small>` 
      });
    }
  };

  return { sendValues };
};