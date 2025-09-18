import { useState, useEffect } from "react";
import { useVariables } from "../hooks/addSensor/useVariables";
import { useSensorForm } from "../hooks/addSensor/useSensorForm";
import { useGenerateDescription } from "../hooks/addSensor/useGenerateDescription";
import { Input } from "@/shared/components/inputs/Input";
import { Button } from "@/shared/components/buttons/Button"
import { ToggleButton } from "@/features/Auth/components/buttons/Button";
import { Modal } from "../components/modals/Modal"
import { motion } from "framer-motion";


export const AddSensor = () => {
  const [optionForm, setOptionForm] = useState("Registrar");
  const { dataVariable } = useVariables();
  
  // Estados para el focus de inputs (si los necesitas)
  const [inputRegSerial, setInputRegSerial] = useState(false);
  const [inputRegCodigo, setInputRegCodigo] = useState(false);
  const [inputRegNombre, setInputRegNombre] = useState(false);
  const [inputModSerial, setInputModSerial] = useState(false);
  const [inputModCodigo, setInputModCodigo] = useState(false);
  const [inputModNombre, setInputModNombre] = useState(false);

 

  const {
    regSerial, setRegSerial,
    regCodigo, setRegCodigo,
    regNombre, setRegNombre,
    regVariable, setRegVariable,
    regDescripcion, setRegDescripcion,

    modSerial, setModSerial,
    modCodigo, setModCodigo,
    modNombre, setModNombre,
    modVariable, setModVariable,
    modDescripcion, setModDescripcion,
    selectedModSensor, setSelectedModSensor,

    allSensors, fetchSensors, selectSensorToEdit, clearModForm,
    sendData, updateData,
  } = useSensorForm();

   const isRegisterDisabled =
  !regSerial || 
  !regCodigo || 
  !regNombre || 
  !regVariable || 
  !regDescripcion;

  const {
    descriptionIA,
    suggestion,
    success,
    showModal,
    loading,
    manualFallback,
    generateDescription,
    closeModal,
  } = useGenerateDescription();

  useEffect(() => {
    fetchSensors();
  }, []);

  // Limpiar formulario de modificación cuando cambias a "Registrar"
  useEffect(() => {
    if (optionForm === "Registrar") {
      clearModForm();
    }
  }, [optionForm]);

  const resetRegisterForm = () => {
    setRegSerial("");
    setRegCodigo("");
    setRegNombre("");
    setRegVariable("");
    setRegDescripcion("");
  };

  const handleApprove = (desc) => {
    if (optionForm === "Registrar") setRegDescripcion(desc);
    else setModDescripcion(desc);
    closeModal();
  };

  if (loading) return <p>Cargando variables...</p>;

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center">
      <div className="relative flex flex-col items-center w-1/2 p-10">
        {/* ToggleButton fijo */}
        <div className="w-full max-w-2xl flex justify-center mt-10">
          <ToggleButton
            option={optionForm}
            setOption={setOptionForm}
            leftOption="Modificar"
            rightOption="Registrar"
          />
        </div>

        {/* Formulario con margin-top fijo */}
        <div className="mt-24 w-full flex justify-center">
          <div className="relative p-4 w-[700px] h-auto bg-white shadow-lg border py-7 overflow-hidden rounded-md">

            {/* FORMULARIO REGISTRAR */}
            {optionForm === "Registrar" && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-lg space-y-4"
            >
              <Input label="Serial" value={regSerial} setValue={setRegSerial} type="text" input={inputRegSerial} setInput={setInputRegSerial} />
              <Input label="Código" value={regCodigo} setValue={setRegCodigo} type="text" input={inputRegCodigo} setInput={setInputRegCodigo} />
              <Input label="Nombre del sensor" value={regNombre} setValue={setRegNombre} type="text" input={inputRegNombre} setInput={setInputRegNombre} />

              <select
                className="p-2 border w-full rounded cursor-pointer outline-none"
                value={regVariable}
                onChange={(e) => setRegVariable(e.target.value)}
              >
                <option value="" disabled hidden>Seleccionar variable</option>
                {dataVariable.map(v => (
                  <option key={v.id} value={v.name}>{v.name}</option>
                ))}
              </select>

              <Button
                onClick={() => generateDescription(regNombre, regVariable)}
                disabled={!regNombre || !regVariable}
                variant="primary"
                size="full"
              >
                {loading ? "Generando..." : "Generar descripción"}
              </Button>

              {/* 🔹 Caso 1: Modal IA */}
              {showModal && (
                <Modal
                  descriptionIA={descriptionIA}
                  success={success}
                  suggestion={suggestion}
                  onApprove={handleApprove}
                  onClose={closeModal}
                />
              )}

              {/* 🔹 Caso 2: Fallback manual */}
              {manualFallback && (
                <div className="mt-4">
                  <p className="text-gray-600">El servicio de IA no respondió a tiempo. Ingresa la descripción manualmente:</p>
                  <textarea
                    className="w-full p-2 mt-2 border rounded-md"
                    rows="4"
                    value={regDescripcion}
                    onChange={(e) => setRegDescripcion(e.target.value)}
                    placeholder="Escribe la descripción del sensor aquí..."
                  />
                </div>
              )}

              {/* {regDescripcion && (
                <div className="mt-4">
                  <p className="text-gray-500">Descripción:</p>
                  <p className="text-gray-900">{regDescripcion}</p>
                </div>
              )} */}

              <Button
                onClick={() =>
                  sendData({
                    serial: regSerial,
                    code: regCodigo,
                    name: regNombre,
                    variable: regVariable,
                    description: regDescripcion,
                  }, resetRegisterForm)
                }
                disabled={isRegisterDisabled}
                variant="primary"
                size="full"
                className="mt-6"
              >
                Registrar Sensor
              </Button>
            </motion.div>
          )}


            {/* FORMULARIO MODIFICAR */}
            {optionForm === "Modificar" && (
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-lg space-y-4"
              >
                <select
                  className="p-2 border w-full rounded cursor-pointer outline-none"
                  value={selectedModSensor}
                  onChange={(e) => {
                    console.log("🔄 Select onChange:", e.target.value);
                    selectSensorToEdit(e.target.value);
                  }}
                >
                  <option value="" disabled>Seleccionar sensor a modificar</option>
                  {allSensors.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} - {s.serial}
                    </option>
                  ))}
                </select>

                {/* Mostrar información actual si hay un sensor seleccionado */}
                {selectedModSensor && (
                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <p className="text-sm text-blue-700 font-medium">Sensor seleccionado:</p>
                    <p className="text-sm text-blue-600">
                      {allSensors.find(s => s.id === parseInt(selectedModSensor))?.name} 
                      ({allSensors.find(s => s.id === parseInt(selectedModSensor))?.serial})
                    </p>
                  </div>
                )}

                <Input 
                  label="Serial" 
                  value={modSerial} 
                  setValue={setModSerial} 
                  type="text" 
                  input={inputModSerial} 
                  setInput={setInputModSerial} 
                />
                
                <Input 
                  label="Código" 
                  value={modCodigo} 
                  setValue={setModCodigo} 
                  type="text" 
                  input={inputModCodigo} 
                  setInput={setInputModCodigo} 
                />
                
                {/* <Input 
                  label="Nombre del sensor" 
                  value={modNombre} 
                  setValue={setModNombre} 
                  type="text" 
                  input={inputModNombre} 
                  setInput={setInputModNombre} 
                /> */}

                <select
                  className="p-2 border w-full rounded cursor-pointer outline-none"
                  value={modVariable}
                  onChange={(e) => setModVariable(e.target.value)}
                >
                  <option value="" disabled hidden>Seleccionar variable</option>
                  {dataVariable.map(v => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>

                <textarea
                  className="p-2 border w-full rounded resize-y min-h-[100px] outline-none"
                  placeholder="Escribe la descripción del sensor..."
                  value={modDescripcion}
                  onChange={(e) => setModDescripcion(e.target.value)}
                />

                <Button
                  onClick={() =>
                    updateData(selectedModSensor, {
                      codigo: modCodigo,
                      nombre: modNombre,
                      variable: modVariable,
                      descripcion: modDescripcion,
                      serial: modSerial, // 👈 si quieres también enviar el serial
                    })
                  }
                  variant="primary"
                  size="full"
                  className="mt-6"
                  disabled={!selectedModSensor}
                >
                  Actualizar Sensor
                </Button>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};