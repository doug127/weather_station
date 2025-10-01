import { useEffect, useState } from "react";
import { Check, X, Lock } from "lucide-react";

export const SensorInput = ({
  sensor,
  formValues,
  setFormValues,
  errors,
  setErrors,
  hasExistingData = false,
}) => {
  const [focused, setFocused] = useState({});
  const [enabledInputs, setEnabledInputs] = useState({});
  const [inputStr, setInputStr] = useState(
    formValues?.[sensor.id] !== undefined ? String(formValues[sensor.id]) : ""
  );

  const error = errors?.[sensor.id] || "";
  const isLocked = hasExistingData;
  const isEnabled = enabledInputs[sensor.id] ?? false; // 👈 inicia deshabilitado
  const isDisabled = isLocked || !isEnabled;

  useEffect(() => {
    if (isLocked) {
      setEnabledInputs((prev) => ({ ...prev, [sensor.id]: false }));
    }
  }, [isLocked, sensor.id]);

  // Validación con rango
  const validateValue = (id, rawValue) => {
    const { min, max } = sensor.variable;
    const regex = /^-?\d*(\.\d*)?$/; // números, opcional decimal

    if (!regex.test(rawValue)) {
      setErrors((prev) => ({ ...prev, [id]: "Formato inválido" }));
      return false;
    }

    if (rawValue === "") {
      setErrors((prev) => ({ ...prev, [id]: null }));
      return true;
    }

    const num = parseFloat(rawValue);
    if (isNaN(num)) {
      setErrors((prev) => ({ ...prev, [id]: "Debe ser un número" }));
      return false;
    }

    if (num < min || num > max) {
      setErrors((prev) => ({
        ...prev,
        [id]: `Fuera de rango (${min} – ${max} ${sensor.variable.unit})`,
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, [id]: null }));
    return true;
  };

  // Sincroniza inputStr con formValues
  const syncToForm = (str) => {
    const trimmed = str.trim();
    if (trimmed === "") {
      setFormValues((prev) => {
        const copy = { ...prev };
        delete copy[sensor.id];
        return copy;
      });
      setErrors((prev) => ({ ...prev, [sensor.id]: null }));
      return;
    }

    if (validateValue(sensor.id, trimmed)) {
      setFormValues((prev) => ({
        ...prev,
        [sensor.id]: parseFloat(trimmed),
      }));
    } else {
      setFormValues((prev) => {
        const copy = { ...prev };
        delete copy[sensor.id];
        return copy;
      });
    }
  };

  const handleChange = (e) => {
    if (isDisabled) return;

    const val = e.target.value;
    // Bloquear caracteres no numéricos (excepto punto y -)
    if (!/^-?\d*(\.\d*)?$/.test(val) && val !== "") return;

    setInputStr(val);
    validateValue(sensor.id, val); // validación en vivo
  };

  const handleBlur = () => {
    setFocused((prev) => ({ ...prev, [sensor.id]: false }));
    syncToForm(inputStr);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
      syncToForm(inputStr);
    }
  };

  // Toggle habilitar/deshabilitar
  const toggleEnable = (id) => {
    if (isLocked) return;
    setEnabledInputs((prev) => ({ ...prev, [id]: !prev[id] }));

    if (enabledInputs[sensor.id]) {
      setFormValues((prev) => {
        const copy = { ...prev };
        delete copy[sensor.id];
        return copy;
      });
      setInputStr("");
      setErrors((prev) => ({ ...prev, [sensor.id]: null }));
    }
  };

  return (
    <div className="w-full relative" key={sensor.id}>
      {/* Label flotante */}
      <label
        className={`absolute left-2 transition-all duration-300 ease-in-out pointer-events-none
          ${
            focused[sensor.id] || inputStr
              ? "-top-3 text-xs px-1 bg-white text-gray-700 truncate max-w-full md:max-w-[calc(100%-3rem)]"
              : "top-2 text-gray-400 truncate max-w-full md:max-w-[calc(100%-3rem)]"
          } ${isLocked ? "text-red-600 font-semibold" : ""}`}
      >
        {sensor.name} ({sensor.variable.unit})
      </label>

      <div className="flex flex-row gap-2">
        <input
          type="text"
          value={inputStr}
          onFocus={() =>
            !isDisabled && setFocused((prev) => ({ ...prev, [sensor.id]: true }))
          }
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          className={`w-full p-2 outline-none rounded-md border
            ${
              error
                ? "border-red-500"
                : focused[sensor.id] || inputStr
                ? "border-gray-900"
                : "border-gray-200"
            }
            ${
              isLocked
                ? "bg-red-50 border-red-400 cursor-not-allowed text-gray-700 font-semibold"
                : isDisabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : ""
            }`}
          placeholder={isLocked ? "🔒 Bloqueado" : ""}
        />

        {/* Toggle button */}
        {!isLocked && (
          <button
            type="button"
            onClick={() => toggleEnable(sensor.id)}
            className={`p-2 border rounded-md transition-colors shrink-0
              ${
                isEnabled
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
          >
            {isEnabled ? <Check size={18} /> : <X size={18} />}
          </button>
        )}
      </div>

      {/* Mensaje condicional */}
      {!isLocked && (
        <p
          className={`text-xs mt-1 truncate ${
            error ? "text-red-500" : "text-gray-500"
          }`}
        >
          {error
            ? error
            : `Rango permitido: ${sensor.variable.min} – ${sensor.variable.max} ${sensor.variable.unit}`}
        </p>
      )}

      {/* Badge bloqueado */}
      {isLocked && (
        <span className="text-red-600 text-xs mt-1 flex items-center gap-1 font-semibold">
          <Lock size={14} />
          Registro bloqueado - Ya existe en DB
        </span>
      )}
    </div>
  );
};
