import { useState, useEffect } from "react";
import { api } from "@/shared/api/apiRoutes";

export const useValuesByTimestamp = (selectedDate, selectedTime) => {
  const [valuesByTimestamp, setValuesByTimestamp] = useState([]);
  const [loadingValues, setLoadingValues] = useState(false);

  useEffect(() => {
    if (!selectedDate || !selectedTime) return;

    const fetchValues = async () => {
      try {
        setLoadingValues(true);

        console.log("📥 selectedDate recibido:", selectedDate);
        console.log("📥 selectedTime recibido:", selectedTime);

        // Parsear la hora
        const [hours, minutes] = selectedTime.split(":").map(Number);
        
        // Crear fecha según el tipo de input
        let date;
        
        if (selectedDate instanceof Date) {
          date = new Date(selectedDate);
          date.setHours(hours, minutes, 0, 0);
        } 
        else if (typeof selectedDate === 'string') {
          if (selectedDate.includes('-')) {
            const [year, month, day] = selectedDate.split("-").map(Number);
            date = new Date(year, month - 1, day, hours, minutes, 0, 0);
          }
          else if (selectedDate.includes('/')) {
            const [day, month, year] = selectedDate.split("/").map(Number);
            date = new Date(year, month - 1, day, hours, minutes, 0, 0);
          }
          else {
            throw new Error(`Formato de fecha no reconocido: ${selectedDate}`);
          }
        }
        else {
          throw new Error(`Tipo de fecha no soportado: ${typeof selectedDate}`);
        }

        // Validar que la fecha sea válida
        if (isNaN(date.getTime())) {
          throw new Error(`Fecha inválida construida`);
        }

        // Formatear fecha: YYYY-MM-DD HH:mm:ss
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = '00';

        // Obtener el offset de zona horaria
        const offset = -date.getTimezoneOffset(); // En minutos
        const offsetHours = Math.floor(Math.abs(offset) / 60);
        const offsetMinutes = Math.abs(offset) % 60;
        const offsetSign = offset >= 0 ? '+' : '-';
        const timezoneStr = `${offsetSign}${String(offsetHours).padStart(2, '0')}`;
        
        // Si hay minutos en el offset (ej: +05:30)
        const timezoneWithMinutes = offsetMinutes > 0 
          ? `${timezoneStr}:${String(offsetMinutes).padStart(2, '0')}`
          : timezoneStr;

        // Construir timestamp: "YYYY-MM-DD HH:mm:ss±HH"
        const timestamp = `${year}-${month}-${day} ${hour}:${minute}:${second}${timezoneStr}`;

        console.log("🕐 Fecha local construida:", date.toString());
        console.log("🌍 Zona horaria detectada:", timezoneWithMinutes);
        console.log("📤 Timestamp formateado:", timestamp);

        // Encode el timestamp para la URL
        const encodedTimestamp = encodeURIComponent(timestamp);
        
        const res = await api.get(`/value/by-timestamp?timestamp=${encodedTimestamp}`);
        
        console.log("✅ Respuesta del servidor:", res.data);
        
        setValuesByTimestamp(res.data.values || []);
        
      } catch (error) {
        console.error("❌ Error al obtener valores por timestamp:", error);
        setValuesByTimestamp([]);
      } finally {
        setLoadingValues(false);
      }
    };

    fetchValues();
  }, [selectedDate, selectedTime]);

  return { valuesByTimestamp, loadingValues };
};