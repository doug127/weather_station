import { useState } from "react";
import { Input } from "../components/forms/inputs/InputValue";
import { InputTimestamp } from "../components/forms/inputs/InputTimestamp";
import { useSensors } from "../hooks/addValues/useSensors";
import { useSendValues } from "../hooks/addValues/useSendValues";
import { Button } from "@/shared/components/buttons/Button"
import { SkeletonPage } from "@/shared/components/skeletons/SkeletonPage";

export const AddValues = () => {
    const [formValues, setFormValues] = useState({});
    const [errors, setErrors] = useState({});
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
    
    const hasErrors = Object.values(errors).some(e => e);

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
                                    errors={errors}
                                    setErrors={setErrors}
                                />
                            ))}
                        </div>
                    </div>
                    
                    <Button 
                        onClick={sendValues}
                        size= "full" 
                        className = "mt-4" 
                        disabled={hasErrors || sensors.length === 0}
                    >
                        Registrar valores
                    </Button>
                </div>
            </div>
        </div>
    );
};
