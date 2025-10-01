import { useRef } from "react";

export const InputDate = ({ dateRange, setDateRange, id, className="" }) => {
  const isStart = id === "date-start";
  const value = isStart ? dateRange.min : dateRange.max;
  const labelText = isStart ? "Fecha de inicio" : "Fecha fin";

  // referencia al input
  const inputRef = useRef(null);

  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker?.(); // 🔑 método moderno (Chrome, Edge)
      inputRef.current.focus();        // fallback para Safari/Firefox
    }
  };

  return (
    <div className="relative w-52">
      {/* Input */}
      <input
        ref={inputRef}
        type="date"
        id={id}
        value={value || ""}
        onChange={(e) =>
          setDateRange({
            ...dateRange,
            [isStart ? "min" : "max"]: e.target.value,
          })
        }
        className={`peer block w-full rounded-md border border-gray-300 bg-transparent pr-6 pl-3 pt-5 pb-2 text-sm text-gray-900
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          appearance-none
          [&::-webkit-calendar-picker-indicator]:hidden 
          [&::-webkit-inner-spin-button]:hidden 
          [&::-webkit-clear-button]:hidden
          cursor-pointer ${className}`}
        placeholder=" "
        {...(isStart
          ? { max: dateRange.max || undefined }
          : { min: dateRange.min || undefined })}
      />

      {/* Label flotante */}
      <label
        htmlFor={id}
        className="absolute left-3 top-1 text-gray-500 text-sm transition-all
          peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
          peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
      >
        {labelText}
      </label>

      {/* Ícono personalizado clickeable */}
      <svg
        onClick={handleIconClick}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
      </svg>
    </div>
  );
};
