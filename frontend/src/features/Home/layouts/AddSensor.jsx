<<<<<<< HEAD
import { useState } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> ms
import { useVariables } from "../hooks/addSensor/useVariables";
import { useSensorForm } from "../hooks/addSensor/useSensorForm";
import { useGenerateDescription } from "../hooks/addSensor/useGenerateDescription";
import { Input } from "@/shared/components/inputs/Input";
import { Button } from "@/shared/components/buttons/Button"
<<<<<<< HEAD
import { Modal } from "../components/modals/Modal"

export const AddSensor = () => {
  const [step, setStep] = useState([1]);
  const [addForm, setAddForm] = useState("form");

  const { dataVariable } = useVariables();
  const {
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
    stepOne,
    finalDescription,
    setFinalDescription,
    sendData,
  } = useSensorForm();

  const addStep = (num) =>
    setStep((prev) => (prev.includes(num) ? prev : [...prev, num]));
  const removeStep = (num) =>
    setStep((prev) => prev.filter((n) => n !== num));

  const resetForm = () => {
    setValueSensor("");
    setValueCodigo("");
    setValueNombre("");
    setSelectedVariable("");
    setFinalDescription("");
    setAddForm("form");
    setStep([1]);
  };

  const {
    descriptionIA,
=======
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

  const {
    descriptionIA,
    suggestion,
    success,
>>>>>>> ms
    showModal,
    loading,
    generateDescription,
    closeModal,
  } = useGenerateDescription();

<<<<<<< HEAD
  // Al aceptar en el modal, se guarda la descripción y se avanza al paso de confirmación
  const handleApprove = (desc) => {
    setFinalDescription(desc);
    addStep(2);
    setAddForm("finish");
=======
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
>>>>>>> ms
    closeModal();
  };

  if (loading) return <p>Cargando variables...</p>;

  return (
<<<<<<< HEAD
    <div className="w-full">
      {showModal && (
        <Modal
          descriptionIA={descriptionIA}
          onApprove={handleApprove}
          onClose={closeModal}
        />
      )}

      <div className="w-full h-full flex flex-col justify-center items-center p-5">
        <div className="w-full p-5">
          <h1 className="text-xl">Pasos para registrar el sensor</h1>
          <div className="w-full py-3 text-gray-400 space-y-1">
            <p>- El código debe ser como mínimo de 4 caracteres</p>
            <p>- El nombre del sensor debe ser único</p>
            <p>- El código debe ser único</p>
            <p>- Ninguno de los campos puede estar vacío o tener caracteres especiales</p>
          </div>
        </div>

        <div className="w-full h-24 flex justify-center items-center mb-4">
          <div
            className={`w-20 h-20 rounded-full border-4 ${
              stepOne ? "border-green-400" : "border-gray-400"
            } flex justify-center items-center`}
          >
            <p>
              <i className="fa-solid fa-1 text-xl"></i>
            </p>
          </div>
          <div className="w-20 h-1 bg-gray-400 relative overflow-hidden">
            <div
              className={`w-full h-full bg-green-400 absolute ${
                step.includes(2) ? "left-0" : "-left-20"
              } transition duration-500 ease-in-out`}
            ></div>
          </div>
          <div
            className={`w-20 h-20 rounded-full border-4 ${
              step.includes(2) ? "border-green-400" : "border-gray-400"
            } flex justify-center items-center transition duration-700 ease-in-out`}
          >
            <p>
              <i className="fa-solid fa-2 text-xl"></i>
            </p>
          </div>
        </div>

        <div className="w-full h-96 flex flex-col justify-center items-center">
          <div className="relative p-4 w-[700px] h-full bg-white shadow-lg border py-7 overflow-hidden rounded-md">
            {/* Formulario de registro */}
            <form
              className={`absolute transition-all duration-500 ease-in-out w-full h-full p-5 ${
                addForm === "finish"
                  ? "pointer-events-none -left-[100%] opacity-0"
                  : "opacity-100 left-0"
              }`}
            >
              <div className="w-full flex flex-col space-y-4 ">
                <div className="flex space-x-2 w-full h-full justify-center items-center">
                  <Input
                    label="Serial"
                    value={valueSensor}
                    setValue={setValueSensor}
                    input={inputSensor}
                    setInput={setInputSensor}
                    type="text"
                  />

                  <Input
                    label="Código"
                    value={valueCodigo}
                    setValue={setValueCodigo}
                    input={inputCodigo}
                    setInput={setInputCodigo}
                    type="text"
                  />
                </div>

                <div className="flex space-x-2">
                  <Input
                    label="Nombre del sensor"
                    value={valueNombre}
                    setValue={setValueNombre}
                    input={inputNombre}
                    setInput={setInputNombre}
                    type="text"
                  />
                  <div className="w-full">
                    <select
                      className="p-2 border w-full rounded cursor-pointer outline-none"
                      value={selectedVariable}
                      onChange={(e) => setSelectedVariable(e.target.value)}
                    >
                      <option value="" disabled hidden>
                        Seleccionar variable
                      </option>
                      {dataVariable.map((variable) => (
                        <option key={variable.id} value={variable.name}>
                          {variable.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </form>

            {/* Confirmación de datos */}
            <div
              className={`absolute transition-all duration-500 ease-in-out w-full h-full p-5 ${
                addForm === "form"
                  ? "pointer-events-none -left-[100%] opacity-0"
                  : "opacity-100 left-0 top-0"
              }`}
            >
              <div className="flex flex-col space-y-4 w-full h-full">
                <h1 className="py-2 text-gray-500">
                  <i className="fa-solid fa-circle-exclamation text-yellow-500"></i>{" "}
                  Verifique que todos los datos sean correctos. Una vez
                  registrado, no podrá cambiar los datos.
                </h1>
                <p className="text-gray-400">
                  Serial : <span className="text-gray-900 ">{valueSensor} </span>
                </p>
                <p className="text-gray-400">
                  Codigo : <span className="text-gray-900 ">{valueCodigo}</span>
                </p>
                <p className="text-gray-400">
                  Nombre del sensor :{" "}
                  <span className="text-gray-900 ">{valueNombre}</span>
                </p>
                <p className="text-gray-400">
                  Variable :{" "}
                  <span className="text-gray-900 ">{selectedVariable}</span>
                </p>
                <p className="text-gray-400">
                  Descripción :{" "}
                  <span className="text-gray-900 ">{finalDescription}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="w-full h-20 flex justify-center items-center mt-5 space-x-2">
            <Button
              onClick={() => (removeStep(2), setAddForm("form"))}
              disabled={addForm === "form"}
              variant="primary"
              size="md"
              className="w-56"
            >
              Volver
            </Button>

            {addForm === "finish" ? (
              <Button
                onClick={() => sendData(resetForm)}
                variant="primary"
                size="md"
                className="w-56"
              >
                Registrar datos
              </Button>
            ) : (
              <Button
                onClick={() =>
                  generateDescription(valueNombre, selectedVariable)
                }
                disabled={!stepOne || !valueNombre || !selectedVariable}
                variant="primary"
                size="md"
                className="w-56"
              >
                Siguiente
              </Button>
            )}
=======
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
                  Generar descripción
                </Button>

                {showModal && (
                  <Modal
                    descriptionIA={descriptionIA}
                    success={success}
                    suggestion={suggestion}
                    onApprove={handleApprove}
                    onClose={closeModal}
                  />
                )}

                {regDescripcion && (
                  <div className="mt-4">
                    <p className="text-gray-500">Descripción:</p>
                    <p className="text-gray-900">{regDescripcion}</p>
                  </div>
                )}

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

>>>>>>> ms
          </div>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> ms
