import { useEffect, useState } from "react";
import { api } from "../../api/apiRoutes";
import Swal from "sweetalert2";


export const AddValues = () => {
    const [sensors, setSensors] = useState([]);
    const [formValues, setFormValues] = useState({});
    const [focused, setFocused] = useState({});
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
                    onClick={sendValues}  // NUEVO: Botón para enviar datos
                >
                    Registrar valores
                </button>

                <div className="w-[700px] h-auto bg-white rounded-md shadow-lg">
                    <div className="w-full">
                        <div className="w-full flex px-3 py-2 space-x-2">
                            <div className="w-full">
                                <label htmlFor="hora">Hora</label>
                                <select
                                    className="w-full border p-2 rounded-md cursor-pointer outline-none"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    >
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <option key={i} value={`${String(i).padStart(2, "0")}:00`}>
                                        {String(i).padStart(2, "0")}:00
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full">
                                <label htmlFor="fecha">Fecha</label>
                                <input
                                    className="w-full border p-2 rounded-md cursor-pointer outline-none"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-3 py-2">
                            {sensors.map((sensor) => (
                                <div className="w-full relative" key={sensor.id}>
                                    <label
                                        className={`absolute left-2 transition-all duration-300 ease-in-out pointer-events-none 
                                            ${focused[sensor.id] || formValues[sensor.id]
                                                ? "-top-3 text-xs p-1 bg-white text-gray-700"
                                                : "top-2 text-gray-400"
                                            }`}
                                    >
                                        {sensor.name}
                                    </label>
                                    <input
                                        type="text"
                                        value={formValues[sensor.id] || ""}
                                        onFocus={() =>
                                            setFocused((prev) => ({ ...prev, [sensor.id]: true }))
                                        }
                                        onBlur={() =>
                                            setFocused((prev) => ({ ...prev, [sensor.id]: false }))
                                        }
                                        onChange={(e) =>
                                            setFormValues({
                                                ...formValues,
                                                [sensor.id]: e.target.value,
                                            })
                                        }
                                        className={`w-full p-2 outline-none rounded-md border 
                                            ${focused[sensor.id] || formValues[sensor.id]
                                                ? "border-gray-900"
                                                : "border-gray-200"
                                            }`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
