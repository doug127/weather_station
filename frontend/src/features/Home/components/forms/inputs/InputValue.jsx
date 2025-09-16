import { useState } from "react";
import { Check, X } from "lucide-react";

export const Input = ({ sensor, formValues, setFormValues }) => {
  const [focused, setFocused] = useState({});
  const [enabledInputs, setEnabledInputs] = useState({});

  const toggleEnable = (id) => {
    setEnabledInputs((prev) => ({
      ...prev,
      [id]: !prev[id], // alterna entre habilitado/deshabilitado
    }));

    // si lo desactivamos, borramos su valor
    if (enabledInputs[sensor.id]) {
      setFormValues((prev) => ({
        ...prev,
        [sensor.id]: "",
      }));
    }
  };

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

      <div className="flex flex-row">
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
          disabled={!enabledInputs[sensor.id]} // ✅ ahora sí queda deshabilitado
          className={`w-full p-2 outline-none rounded-md border 
            ${focused[sensor.id] || formValues[sensor.id]
              ? "border-gray-900"
              : "border-gray-200"}
            ${!enabledInputs[sensor.id]
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : ""}`}
        />
        <button
          type="button"
          onClick={() => toggleEnable(sensor.id)}
          className={`p-2 border rounded-md transition-colors ${enabledInputs[sensor.id]
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
        >
          {enabledInputs[sensor.id] ? <Check size={18} /> : <X size={18} />}
        </button>
      </div>
    </div>
  );
};
