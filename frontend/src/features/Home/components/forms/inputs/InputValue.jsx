import {useState} from 'react'

export const Input = ({sensor, formValues, setFormValues}) => {
    const [focused, setFocused] = useState({});

    return (
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
    );
}