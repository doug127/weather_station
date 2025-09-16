<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> ms
import { api } from "@/shared/api/apiRoutes";
import Swal from "sweetalert2";

export const useSensorForm = () => {
<<<<<<< HEAD
  const [valueSensor, setValueSensor] = useState("");
  const [inputSensor, setInputSensor] = useState(false);

  const [valueCodigo, setValueCodigo] = useState("");
  const [inputCodigo, setInputCodigo] = useState(false);

  const [valueNombre, setValueNombre] = useState("");
  const [inputNombre, setInputNombre] = useState(false);

  const [selectedVariable, setSelectedVariable] = useState("");
  const [selectedUnidad, setSelectedUnidad] = useState("");

  const [stepOne, setStepOne] = useState(false);
  const [finalDescription, setFinalDescription] = useState(""); // <-- agregado

  // Validación para habilitar el paso 1
  useEffect(() => {
    if (
      valueSensor.trim() !== "" &&
      valueCodigo.trim() !== "" &&
      valueNombre.trim() !== "" &&
      selectedVariable.trim() !== ""
    ) {
      setStepOne(true);
    } else {
      setStepOne(false);
    }
  }, [valueSensor, valueCodigo, valueNombre, selectedVariable]);

  const sendData = async (resetForm) => {
    if (!finalDescription) {
      return Swal.fire("Atención", "Debe generar o escribir la descripción antes de registrar el sensor.", "warning");
    }

    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez que se envíen los datos, no podrás deshacerlos.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) {
      await Swal.fire("Cancelado", "Has cancelado la acción.", "error");
      return;
    }

    try {
      await api.post("/sensor/create", {
        name: valueNombre,
        code: valueCodigo,
        serial: valueSensor,
        variable: selectedVariable,
        description: finalDescription, 
      });

      resetForm();

      await Swal.fire("¡Hecho!", "El sensor ha sido creado correctamente.", "success");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      const data = error.response?.data || {};
      const errorMessage = data.error || "Ocurrió un error al enviar los datos.";
      const conflict = data.conflict;
      const detailedMessage = conflict
        ? `${errorMessage}. Campo: ${conflict.field}, Valor: "${conflict.value}".`
        : errorMessage;

      await Swal.fire({ title: "Error", text: detailedMessage, icon: "error", confirmButtonText: "Aceptar" });
=======
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
>>>>>>> ms
    }
  };

  return {
<<<<<<< HEAD
    valueSensor,
    setValueSensor,
    inputSensor,
    setInputSensor,
    valueCodigo,
    setValueCodigo,
    inputCodigo,
    setInputCodigo,
    valueNombre,
    setValueNombre,
    inputNombre,
    setInputNombre,
    selectedVariable,
    setSelectedVariable,
    selectedUnidad,
    setSelectedUnidad,
    stepOne,
    finalDescription,       
    setFinalDescription,    
    sendData,
  };
};
=======
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
>>>>>>> ms
