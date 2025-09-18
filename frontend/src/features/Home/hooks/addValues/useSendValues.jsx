import Swal from "sweetalert2";
import { api } from "@/shared/api/apiRoutes";

export const useSendValues = (formValues, selectedDate, selectedTime, resetForm, setLoading, sensors) => {
  const sendValues = async () => {
    if (!selectedDate || !selectedTime) return Swal.fire({ icon: "warning", title: "Campos incompletos", text: "Por favor selecciona la hora y la fecha." });
    if (!formValues || Object.keys(formValues).length === 0) return Swal.fire({ icon: "warning", title: "Sin valores", text: "Por favor ingresa al menos un valor de sensor." });

    const confirmResult = await Swal.fire({
      title: "¿Registrar valores?",
      text: "Se guardarán los datos, se entrenará el modelo y se generará una predicción.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, procesar",
      cancelButtonText: "Cancelar",
    });
    if (!confirmResult.isConfirmed) return;

    const timestamp = new Date(`${selectedDate}T${selectedTime}:00Z`).toISOString();

    try {
      setLoading(true);

      // 🔹 Map sensor_id (key) a sensor.code
      const sensorMap = {};
      sensors.forEach(s => {
        sensorMap[s.id] = s.code;
      });

      // 1️⃣ Guardar valores en la DB
      const savePayload = {
        timestamp,
        values: Object.keys(formValues).map(sensor_id => ({
          sensor_id: Number(sensor_id), 
          value: parseFloat(formValues[sensor_id]),
        })),
      };

      console.log("💾 Guardando valores:", savePayload);
      await api.post("/value/create", savePayload);

      // 2️⃣ Entrenar modelo
      const trainPayload = {
        model_name: "rain_predictor_from_node",
        targets: Object.keys(formValues).map(sensor_id => sensorMap[sensor_id] || sensor_id),
        json_data: [
          {
            timestamp,
            values: Object.keys(formValues).map(sensor_id => ({
              code: sensorMap[sensor_id] || sensor_id,
              value: parseFloat(formValues[sensor_id]),
            })),
          },
        ],
      };

      console.log("🧠 Entrenando modelo con:", trainPayload);
      const trainResponse = await api.post("/model/train-model", trainPayload);
      console.log("✅ Modelo entrenado:", trainResponse.data);

      // 3️⃣ Generar predicción
      const predictionPayload = {
        data: [
          Object.keys(formValues).reduce((acc, sensor_id) => {
            const code = sensorMap[sensor_id] || sensor_id;
            acc[code] = parseFloat(formValues[sensor_id]);
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
        title: "¡Proceso completado!",
        html: `
          <div class="text-left">
            <p>✅ <strong>Valores guardados:</strong> ${Object.keys(formValues).length} sensores</p>
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
      await Swal.fire({ icon: "error", title: "Error en el proceso", text: errorMessage, footer: `<small>Detalles: ${error.message}</small>` });
    }
  };

  return { sendValues };
};

