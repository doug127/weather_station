import { useState, useEffect } from "react";
import { useValuesByTimestamp } from "../hooks/addValues/useValuesByTimestamp";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useSensors } from "../hooks/addValues/useSensors";
import { useSendValues } from "../hooks/addValues/useSendValues";
import { useTrainAndPredict } from "../hooks/addValues/useTrainAndPredict";
import { useUploadFile } from "../hooks/addValues/useUploadFile";
import { ToggleButton } from "@/shared/components/buttons/Button";
import { SensorInput } from "../components/forms/inputs/InputValue";
import { InputTimestamp } from "../components/forms/inputs/InputTimestamp";
import { Button } from "@/shared/components/buttons/Button"
import { SkeletonPage } from "@/shared/components/skeletons/SkeletonPage";

export const AddValues = () => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [optionForm, setOptionForm] = useState("Manual");

  // ---- data hooks (SIEMPRE llamados, sin early returns) ----
  const sensors = useSensors(); // puede ser [] inicialmente
  const { valuesByTimestamp, loadingValues, hasExistingRecords } = useValuesByTimestamp(selectedDate, selectedTime);

  // reset helper — puede pasarse a hooks si lo necesitas
  const resetForm = () => {
    setFormValues({});
    setSelectedDate("");
    setSelectedTime("");
  };

  // Llamar TODOS los custom hooks aquí, en el MISMO ORDEN en cada render
  const { sendValues } = useSendValues(
    formValues,
    selectedDate,
    selectedTime,
    resetForm,
    setLoading,
    sensors
  );

  const { trainAndPredict } = useTrainAndPredict(
    selectedDate,
    selectedTime,
    sensors,
    setLoading
  );

  const { uploadFile, loading: fileLoading, error: fileError, success: fileSuccess } = useUploadFile();

  // ---- efectos (también siempre declarados) ----
  useEffect(() => {
    // Solamente observar valuesByTimestamp — no modificar formValues aquí
    if (valuesByTimestamp.length > 0) {
      // solo para mostrar badges
    }
  }, [valuesByTimestamp]);

  // ---- helpers ----
  const handleSendValues = () => {
    const filteredValues = Object.entries(formValues)
      .filter(([sensorId, value]) => typeof value === "number" && Number.isFinite(value))
      .map(([sensorId, value]) => ({
        sensor_id: Number(sensorId),
        value: value
      }));

    if (filteredValues.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin valores válidos",
        text: "Por favor ingresa al menos un valor de sensor."
      });
      return;
    }

    console.log("Guardando valores filtrados:", filteredValues);
    sendValues(filteredValues);
  };

  const hasErrors = Object.values(errors).some(e => e);
  const isLoading = loading || fileLoading;

  // ---- early render (SOLO después de llamar a todos los hooks) ----
  if (!sensors || sensors.length === 0) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-xl mb-2">⚠️ No hay sensores disponibles</p>
          <p>Por favor verifica la configuración.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <SkeletonPage />;
  }


  return (
    <div className="w-full min-h-[75vh] flex flex-col items-center">
      <div className="relative flex flex-col items-center w-5/6 px-10 py-7">
        <div className="w-full max-w-2xl flex justify-center mt-8">
          <ToggleButton
            option={optionForm}
            setOption={setOptionForm}
            leftOption="Manual"
            rightOption="Archivo"
          />
        </div>

        <div className="mt-24 w-full flex justify-center">
          <div className="relative p-4 w-full h-auto bg-white shadow-lg border pt-7 overflow-hidden rounded-md">
            
            {optionForm === "Manual" && (
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <div className="w-full flex px-3 py-2 space-x-2">
                  <InputTimestamp
                    label="Hora"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                  <InputTimestamp
                    label="Fecha"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                {loadingValues && (
                  <div className="text-center text-gray-500 py-2">
                    Verificando datos existentes...
                  </div>
                )}

                {/* MENSAJE si hay registros existentes */}
                {hasExistingRecords && !loadingValues && (
                  <div className="mx-3 mb-3 p-3 bg-orange-50 border border-orange-300 rounded-md flex items-center gap-2">
                    <Lock size={18} className="text-orange-600" />
                    <span className="text-orange-700 text-sm font-medium">
                      Hay {valuesByTimestamp.length} registro(s) existente(s) para este timestamp
                    </span>
                  </div>
                )}

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-3 py-2">
                  {sensors.map((sensor) => {
                    // VALIDACIÓN - Asegurar que sensor existe y tiene id
                    if (!sensor || !sensor.id) {
                      console.error("❌ Sensor inválido:", sensor);
                      return null;
                    }

                    const sensorData = valuesByTimestamp.find(
                      v => Number(v.sensor_id) === Number(sensor.id)
                    );

                    if (sensorData) {
                      return (
                        <div
                          key={sensor.id}
                          className="p-3 bg-orange-50 border border-orange-300 rounded-md flex justify-between items-center"
                        >
                          <span className="font-medium text-gray-700">{sensor.code}</span>
                          <span className="font-semibold text-orange-600">
                            {sensorData.value ?? "Ø"}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <SensorInput
                        key={sensor.id}
                        sensor={sensor}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        errors={errors}
                        setErrors={setErrors}
                        hasExistingData={false}
                      />
                    );
                  })}
                </div>

                {/* Botón para enviar solo inputs editables */}
                <Button 
                  onClick={handleSendValues} // <--- Aquí usamos la función que filtra
                  size="full" 
                  className="mt-4" 
                  disabled={hasErrors || Object.keys(formValues).length === 0}
                >
                  Registrar valores
                </Button>

                <Button 
                  onClick={trainAndPredict}
                  size="full" 
                  className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={sensors.length === 0}
                >
                  Entrenar y generar predicción
                </Button>
              </motion.div>
            )}

            {/* --- FORMULARIO SUBIDA DE ARCHIVO --- */}
            {optionForm === "Archivo" && (
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subir valores desde Excel
                  </label>
                  
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                  />

                  {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
                  {fileSuccess && <p className="text-green-500 text-sm mt-2">{fileSuccess}</p>}

                  <Button
                    onClick={() => uploadFile(selectedFile)}
                    disabled={!selectedFile || fileLoading}
                    size="full"
                    className="mt-2"
                  >
                    Enviar archivo
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
