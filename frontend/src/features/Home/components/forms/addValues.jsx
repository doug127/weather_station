import { useEffect, useState } from "react";
import { api } from "@/shared/api/apiRoutes";
import { Input } from "./inputs/InputValue";
import { InputTimestamp } from "./inputs/InputTimestamp";
import Swal from "sweetalert2";


export const AddValues = () => {
    const [sensors, setSensors] = useState([]);
    const [formValues, setFormValues] = useState({});
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedDate, setSelectedDate] = useState(""); 

    useEffect(() => {
        const valuesData = async () => {
            try {
                const response = await api.get('/sensor/');
                console.log("Respuesta del backend:", response.data);

                const dataArray = Array.isArray(response.data)
                    ? response.data
                    : response.data.data;

                setSensors(dataArray || []);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        };

        valuesData();
    }, []);

    const sendValues = async () => {
    
        if (!selectedDate || !selectedTime) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor selecciona la hora y la fecha.',
            });
            return;
        }

        // const emptyInputs = sensors.some(sensor => !formValues[sensor.id] || formValues[sensor.id].trim() === '');

        // if (emptyInputs) {
        //     Swal.fire({
        //         icon: 'warning',
        //         title: 'Valores incompletos',
        //         text: 'Por favor completa todos los valores de los sensores.',
        //     });
        //     return;
        // }

        const confirmResult = await Swal.fire({
            title: '¿Registrar valores?',
            text: 'Se guardarán todos los datos ingresados con la hora y fecha seleccionada.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar',
            cancelButtonText: 'Cancelar',
        });

        if (!confirmResult.isConfirmed) return;

        const timestamp = new Date(`${selectedDate}T${selectedTime}:00Z`).toISOString();
        try {
            const payload = {
                timestamp,
                values: Object.keys(formValues).map(sensorId => ({
                    sensor_id: parseInt(sensorId),
                    value: parseFloat(formValues[sensorId])
                }))
            };

            console.log("Payload enviado:", payload);

            const response = await api.post('/value/create', payload);
            console.log("Valores registrados:", response.data);

            await Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Los valores han sido registrados correctamente.',
                confirmButtonText: 'Aceptar'
            });

            setFormValues({});
            setSelectedDate("");
            setSelectedTime("");

        } catch (error) {
            console.error("Error al enviar datos:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                text: error.response?.data?.message || 'Ocurrió un error al registrar los valores.',
            });
        }
    };



    return (
        <div>
            <div className="w-full min-h-[80vh] h-auto flex flex-col justify-center items-center">
                <button 
                    className="w-[700px] p-2 bg-green-600 mb-2 rounded-md text-white hover:bg-green-500"
                    onClick={sendValues}  
                >
                    Registrar valores
                </button>

                <div className="w-[700px] h-auto bg-white rounded-md shadow-lg">
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
                </div>
            </div>
        </div>
    );
};
