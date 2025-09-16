import { useState } from "react";
<<<<<<< HEAD
=======
import { motion } from "framer-motion";
import { ToggleButton } from "@/features/Auth/components/buttons/Button";
>>>>>>> ms
import { Input } from "../components/forms/inputs/InputValue";
import { InputTimestamp } from "../components/forms/inputs/InputTimestamp";
import { useSensors } from "../hooks/addValues/useSensors";
import { useSendValues } from "../hooks/addValues/useSendValues";
<<<<<<< HEAD
=======
import { useUploadFile } from "../hooks/addValues/useUploadFile";
>>>>>>> ms
import { Button } from "@/shared/components/buttons/Button"
import { SkeletonPage } from "@/shared/components/skeletons/SkeletonPage";

export const AddValues = () => {
<<<<<<< HEAD
    const [formValues, setFormValues] = useState({});
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedDate, setSelectedDate] = useState(""); 
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setFormValues({});
        setSelectedDate("");
        setSelectedTime("");
    };

    const sensors = useSensors();
    const { sendValues } = useSendValues(formValues, selectedDate, selectedTime, resetForm, setLoading);

    if (loading) {
        return <SkeletonPage />; // 👈 muestra skeleton en lugar del formulario
    }

    return (
        <div>
            <div className="w-full min-h-[80vh] h-auto flex flex-col justify-center items-center">
                <div className="w-[700px] h-auto bg-white rounded-md shadow-lg pt-4">
                    <div className="w-full">
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
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-3 py-2">
                            {sensors.map((sensor) => (
                                <Input 
                                    key={sensor.id} 
                                    sensor={sensor} 
                                    formValues={formValues} 
                                    setFormValues={setFormValues} 
                                />
                            ))}
                        </div>
                    </div>
                    
                    <Button 
                        onClick={sendValues}
                        size= "full" 
                        className = "mt-4" 
                    >
                        Registrar valores
                    </Button>
                </div>
            </div>
        </div>
    );
};
=======
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [optionForm, setOptionForm] = useState("Manual"); // 👈 estado para toggle

  const resetForm = () => {
    setFormValues({});
    setSelectedDate("");
    setSelectedTime("");
  };

  const sensors = useSensors();
  const { sendValues } = useSendValues(
    formValues,
    selectedDate,
    selectedTime,
    resetForm,
    setLoading
  );

  const hasErrors = Object.values(errors).some(e => e);

  // 👇 Hook para subir archivo
  const { uploadFile, loading: fileLoading, error: fileError, success: fileSuccess } = useUploadFile();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  if (loading || fileLoading) {
    return <SkeletonPage />;
  }

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center">
      <div className="relative flex flex-col items-center w-5/6 p-10">
        {/* ToggleButton */}
        <div className="w-full max-w-2xl flex justify-center mt-10">
          <ToggleButton
            option={optionForm}
            setOption={setOptionForm}
            leftOption="Manual"
            rightOption="Archivo"
          />
        </div>

        {/* Contenedor de formularios */}
        <div className="mt-24 w-full flex justify-center">
          <div className="relative p-4 w-full h-auto bg-white shadow-lg border py-7 overflow-hidden rounded-md">
            
            {/* --- FORMULARIO MANUAL --- */}
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

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-3 py-2">
                  {sensors.map((sensor) => (
                    <Input 
                      key={sensor.id} 
                      sensor={sensor} 
                      formValues={formValues} 
                      setFormValues={setFormValues} 
                      errors={errors}
                      setErrors={setErrors}
                    />
                  ))}
                </div>
                
                <Button 
                  onClick={sendValues}
                  size="full" 
                  className="mt-4" 
                  disabled={hasErrors || sensors.length === 0}
                >
                  Registrar valores
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
                
                {/* Input para seleccionar archivo */}
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => setSelectedFile(e.target.files[0])} // guardamos el archivo en estado
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                />

                {/* Mostrar errores o éxito */}
                {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
                {fileSuccess && <p className="text-green-500 text-sm mt-2">{fileSuccess}</p>}

                {/* Botón para enviar archivo */}
                <Button
                    onClick={() => uploadFile(selectedFile)}
                    disabled={!selectedFile || fileLoading} // deshabilitar si no hay archivo o está subiendo
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
>>>>>>> ms
