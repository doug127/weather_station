import { useState } from "react";
import { Check, X } from "lucide-react";

export const Input = ({ sensor, formValues, setFormValues, errors, setErrors }) => {
  const [focused, setFocused] = useState({});
  const [enabledInputs, setEnabledInputs] = useState({});

  const toggleEnable = (id) => {
    setEnabledInputs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    if (enabledInputs[sensor.id]) {
      setFormValues((prev) => ({
        ...prev,
        [sensor.id]: "",
      }));
      setErrors((prev) => ({
        ...prev,
        [sensor.id]: null,
      }));
    }
  };

  const validateValue = (id, rawValue) => {
    const { min, max } = sensor.variable;
    const regex = /^-?\d*(\.\d+)?$/;

    if (!regex.test(rawValue)) {
      setErrors((prev) => ({ ...prev, [id]: "Formato inválido" }));
      return false;
    }

    const num = parseFloat(rawValue);
    if (isNaN(num)) {
      setErrors((prev) => ({ ...prev, [id]: "Debe ser un número" }));
      return false;
    }

    if (num < min || num > max) {
      setErrors((prev) => ({ ...prev, [id]: `Fuera de rango (${min} - ${max})` }));
      return false;
    }

    setErrors((prev) => ({ ...prev, [id]: null }));
    return true;
  };

  return (
    <div className="w-full relative" key={sensor.id}>
      <label
        className={`absolute left-2 transition-all duration-300 ease-in-out pointer-events-none 
          ${focused[sensor.id] || formValues[sensor.id]
            ? "-top-3 text-xs px-1 bg-white text-gray-700 truncate max-w-full md:max-w-[calc(100%-3rem)]"
            : "top-2 text-gray-400 truncate max-w-full md:max-w-[calc(100%-3rem)]"
          }`}
      >
        {sensor.name} ({sensor.variable.unit})
      </label>

      <div className="flex flex-row gap-2">
        <input
          type="text"
          value={formValues[sensor.id] || ""}
          onFocus={() =>
            setFocused((prev) => ({ ...prev, [sensor.id]: true }))
          }
          onBlur={() =>
            setFocused((prev) => ({ ...prev, [sensor.id]: false }))
          }
          onChange={(e) => {
            const val = e.target.value;
            setFormValues({ ...formValues, [sensor.id]: val });
            if (val !== "") validateValue(sensor.id, val);
          }}
          disabled={!enabledInputs[sensor.id]}
          className={`w-full p-2 outline-none rounded-md border
            ${errors[sensor.id]
              ? "border-red-500"
              : focused[sensor.id] || formValues[sensor.id]
                ? "border-gray-900"
                : "border-gray-200"}
            ${!enabledInputs[sensor.id]
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : ""}`}
        />
        <button
          type="button"
          onClick={() => toggleEnable(sensor.id)}
          className={`p-2 border rounded-md transition-colors shrink-0
            ${enabledInputs[sensor.id]
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          {enabledInputs[sensor.id] ? <Check size={18} /> : <X size={18} />}
        </button>
      </div>

      {enabledInputs[sensor.id] && (
        <p className="text-xs text-gray-500 mt-1 truncate">
          Rango permitido: {sensor.variable.min} – {sensor.variable.max} {sensor.variable.unit}
        </p>
      )}

      {errors[sensor.id] && (
        <p className="text-xs text-red-500 mt-1 truncate">{errors[sensor.id]}</p>
      )}
    </div>
  );
};
