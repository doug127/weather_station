import { useEffect, useState } from "react";
import { api } from "@/shared/api/apiRoutes";
import { ChevronDown } from "lucide-react";

export const Article = () => {
    const [sensors, setSensors] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        const fetchSensors = async () => {
            try {
                const response = await api.get('/sensor');
                const data = response.data.data;
                const filteredSensors = data.filter(sensor => sensor.description !== null);
                setSensors(filteredSensors);

            } catch (error) {
                console.error("Error fetching sensors: ", error);
            }
        };
        fetchSensors();
    }, []);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-[80vh]">
            <div id="accordion-flush" className="divide-y divide-gray-300 dark:divide-gray-400 px-5 h-auto shadow-md bg-white rounded-md py-6">
            {sensors.map((sensor, index) => (
            <div key={sensor.id}>
                <h2 id={`accordion-flush-heading-${index}`}>
                <button
                    type="button"
                    className="flex items-center justify-between w-full py-5 font-medium text-black-700 dark:text-black-300 gap-3"
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={openIndex === index}
                    aria-controls={`accordion-flush-body-${index}`}
                >
                    <span>{sensor.name}</span>
                    <ChevronDown
                    className={`w-4 h-4 transform transition-transform duration-300 ${
                        openIndex === index ? "rotate-180" : ""
                    }`}
                    />
                </button>
                </h2>
                <div
                id={`accordion-flush-body-${index}`}
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                }`}
                aria-labelledby={`accordion-flush-heading-${index}`}
                >
                <div className="py-4 text-black-900 dark:text-black-900">
                    <p>{sensor.description}</p>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}