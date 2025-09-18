import { useState } from "react";
import { api } from "@/shared/api/apiRoutes";
import Swal from "sweetalert2";

export const useSensorForm = () => {
  // Registrar
  const [regSerial, setRegSerial] = useState("");
  const [regCodigo, setRegCodigo] = useState("");
  const [regNombre, setRegNombre] = useState("");
  const [regVariable, setRegVariable] = useState("");
  const [regDescripcion, setRegDescripcion] = useState("");

  // Modificar
  const [modSerial, setModSerial] = useState("");
  const [modCodigo, setModCodigo] = useState("");
  const [modNombre, setModNombre] = useState("");
  const [modVariable, setModVariable] = useState("");
  const [modDescripcion, setModDescripcion] = useState("");
  const [selectedModSensor, setSelectedModSensor] = useState("");

  const [allSensors, setAllSensors] = useState([]);

  // Cargar todos los sensores
  const fetchSensors = async () => {
    try {
      const res = await api.get("/sensor/");
      console.log("📊 Sensores cargados:", res.data.data);
      setAllSensors(res.data.data);
    } catch (error) {
      console.error("❌ Error al cargar sensores", error);
    }
  };

  // Seleccionar sensor para modificar
  const selectSensorToEdit = (sensorId) => {
    console.log("🔍 Seleccionando sensor ID:", sensorId, "Tipo:", typeof sensorId);
    
    // Convertir a número para la comparación
    const numericSensorId = parseInt(sensorId);
    setSelectedModSensor(sensorId);
    
    // Buscar el sensor (comparando con número)
    const sensor = allSensors.find((s) => s.id === numericSensorId);
    
    console.log("📋 Sensor encontrado:", sensor);
    console.log("📊 Todos los sensores disponibles:", allSensors.map(s => ({ id: s.id, name: s.name })));
    
    if (!sensor) {
      console.log("❌ No se encontró el sensor");
      return;
    }

    const variableName = sensor.variable?.name || "";

    // Llenar los campos del formulario de modificación
    console.log("✅ Llenando campos con:", {
      serial: sensor.serial,
      code: sensor.code,
      name: sensor.name,
      variable: sensor.variable,
      description: sensor.description
    });

    setModSerial(sensor.serial || "");
    setModCodigo(sensor.code || "");
    setModNombre(sensor.name || "");
    setModVariable(variableName);
    setModDescripcion(sensor.description || "");
  };

  // Limpiar formulario de modificación
  const clearModForm = () => {
    setSelectedModSensor("");
    setModSerial("");
    setModCodigo("");
    setModNombre("");
    setModVariable("");
    setModDescripcion("");
  };

  // Registrar sensor
  const sendData = async (data, resetForm) => {
    try {
      console.log("📤 Enviando datos:", data);
      await api.post("/sensor/create", data);
      resetForm();
      await fetchSensors(); // Recargar lista después de crear
      await Swal.fire("¡Hecho!", "Sensor registrado correctamente", "success");
    } catch (error) {
      console.error("❌ Error al registrar:", error);
      await Swal.fire("Error", "No se pudo registrar el sensor", "error");
    }
  };

  // Actualizar sensor
  const updateData = async (id, data) => {
    try {
      // Buscar el ID del sensor por su serial
      const sensor = allSensors.find(s => s.id === parseInt(id));
      if (!sensor) {
        throw new Error("No se encontró el sensor");
      }

      console.log("📤 Actualizando sensor ID:", sensor.id, "con datos:", data);
      
      await api.patch(`/sensor/update/${sensor.id}`, data);
      await fetchSensors(); // Recargar lista después de actualizar
      clearModForm(); // Limpiar formulario
      await Swal.fire("¡Hecho!", "Sensor actualizado correctamente", "success");
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      await Swal.fire("Error", "No se pudo actualizar el sensor", "error");
    }
  };

  return {
    // Registrar
    regSerial, setRegSerial,
    regCodigo, setRegCodigo,
    regNombre, setRegNombre,
    regVariable, setRegVariable,
    regDescripcion, setRegDescripcion,

    // Modificar
    modSerial, setModSerial,
    modCodigo, setModCodigo,
    modNombre, setModNombre,
    modVariable, setModVariable,
    modDescripcion, setModDescripcion,
    selectedModSensor, setSelectedModSensor,

    // General
    allSensors, 
    fetchSensors, 
    selectSensorToEdit,
    clearModForm,
    sendData, 
    updateData,
  };
};
