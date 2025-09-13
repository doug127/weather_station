import { useState, useEffect } from "react";
import { api } from "@/shared/api/apiRoutes";
import Swal from "sweetalert2";

export const useSensorForm = () => {
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
    }
  };

  return {
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
