// src/hooks/useTrainAndPredict.jsx
import Swal from "sweetalert2";
import { api } from "@/shared/api/apiRoutes";

/**
 * useTrainAndPredict
 * @param {string} selectedDate - "YYYY-MM-DD"
 * @param {string} selectedTime - "HH:MM"
 * @param {function} setLoading - optional setter to control loading in caller
 */
export const useTrainAndPredict = (selectedDate, selectedTime, setLoading) => {
  // fallback si no te pasan setLoading
  const safeSetLoading = typeof setLoading === "function" ? setLoading : () => {};

  const trainAndPredict = async () => {
    // Validaciones básicas
    if (!selectedDate || !selectedTime) {
      await Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor selecciona la hora y la fecha.",
      });
      return;
    }

    // Confirmación
    const confirmResult = await Swal.fire({
      title: "Confirmar entrenamiento y predicción",
      html:
        `<p>Se utilizarán los valores ya guardados en la base de datos para la fecha/hora seleccionada.</p>` +
        `<p><strong>Fecha:</strong> ${selectedDate} <strong>Hora:</strong> ${selectedTime}</p>` +
        `<p>¿Deseas continuar?</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
      width: 600,
    });

    if (!confirmResult.isConfirmed) return;

    const timestamp = new Date(`${selectedDate}T${selectedTime}:00Z`).toISOString();

    try {
      safeSetLoading(true);

      // Loading modal
      Swal.fire({
        title: "Procesando...",
        html: "Entrenando modelo y generando predicción. Esto puede tardar unos segundos.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await api.post("/model/train-and-predict", { timestamp });

      // Cerrar loading
      try { Swal.close(); } catch (e) {}
      safeSetLoading(false);

      const predictions = res.data.predictions ?? res.data.predict_response ?? res.data.django_response?.predictions ?? null;
      const summary = res.data.payload_summary ?? null;

      // Build HTML result
      let html = `<div class="text-left">`;
      if (summary) {
        html += `<p>📊 <strong>Filas enviadas:</strong> ${summary.rows_count}</p>`;
        html += `<p>📌 <strong>Targets:</strong> ${summary.targets_count}</p>`;
        html += `<p>🔢 <strong>Puntos de datos:</strong> ${summary.total_data_points}</p>`;
        html += `<p>⌚ <strong>Timestamp usado:</strong> ${summary.used_timestamp_for_prediction ?? "N/A"}</p>`;
      }
      if (predictions) {
        html += `<hr/><p><strong>Predicciones:</strong></p><pre style="white-space:pre-wrap">${JSON.stringify(predictions, null, 2)}</pre>`;
      }
      html += `</div>`;

      await Swal.fire({
        icon: "success",
        title: "Entrenamiento y predicción finalizados",
        html,
        width: 700,
      });

      return res.data;
    } catch (err) {
      // Cerrar loading modal y reset loading
      try { Swal.close(); } catch (e) {}
      safeSetLoading(false);

      console.error("Error en trainAndPredict:", err);

      const status = err?.response?.status;
      const data = err?.response?.data;
      let text = "Hubo un error al procesar la solicitud.";

      if (status === 400) {
        text = data?.message || data?.error || "Solicitud inválida. Verifica los datos en la base de datos.";
      } else if (status === 404) {
        text = data?.message || "Recurso no encontrado en el servidor.";
      } else if (status >= 500) {
        text = "Error en el servidor. Intenta nuevamente más tarde.";
      } else {
        text = err.message || text;
      }

      await Swal.fire({
        icon: "error",
        title: "Error",
        text,
        footer: data ? `<small>${JSON.stringify(data)}</small>` : undefined,
      });

      throw err;
    }
  };

  return { trainAndPredict };
};
