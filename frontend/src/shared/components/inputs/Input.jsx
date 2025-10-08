import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export const Input = ({
  label,
  value,
  setValue,
  input,
  setInput,
  type,
  validationType,
  compareWith,
}) => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!value) {
      setError("");
      return;
    }

    switch (validationType) {
      case "email": {
        const emailRegex = /\S+@\S+\.\S+/;
        setError(emailRegex.test(value) ? "" : "Formato de Correo electrónico inválido.");
        break;
      }
      case "password": {
        const hasMayus = /[A-Z]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const hasNumber = /\d/.test(value);
        setError(
          !hasMayus || !hasSpecialChar || !hasNumber
            ? "La contraseña debe contener al menos una Mayúscula, un carácter especial y un número."
            : ""
        );
        break;
      }
      case "passwordConfirm": {
        setError(value !== compareWith ? "Las contraseñas no coinciden." : "");
        break;
      }
      case "username": {
        setError(value.length < 3 ? "El nombre de usuario debe contener al menos 3 caracteres." : "");
        break;
      }
      
      default:
        setError("");
    }
  }, [value, validationType, compareWith]);

  useEffect(() => {
    const inputs = document.querySelectorAll('input, select, textarea');

    const handleFocus = (event) => {
      // Solo en móviles
      if (window.innerWidth < 768) {
        const yOffset = event.target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: yOffset, behavior: 'smooth' });
      }
    };

    inputs.forEach(input => input.addEventListener('focus', handleFocus));

    return () => {
      inputs.forEach(input => input.removeEventListener('focus', handleFocus));
    };
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col relative w-full">
      <label
        className={`pointer-events-none absolute p-2 transition-[top,font-size] duration-200 ease-in-out h-5
          ${input || value 
            ? "-top-5 lg:-top-4 text-sm sm:text-sm lg:text-sm left-2 lg:bg-white sm:bg-transparent text-gray-500 sm:text-gray-600" 
            : "sm:text-gray-500 text-gray-400 left-2 top-0"}
        `}
      >
        {label}
      </label>

      <div className="flex w-full">
        <input
          className={`p-2 border outline-none w-full ${
            type === "password" ? "rounded-l-md" : "rounded-md"
          } ${value || input ? "border-1 border-gray-200 lg:border-gray-900" : "border-gray-300"}`}
          value={value}
          onChange={(e) => {
            if (type === "number") {
              const val = e.target.value;
              if(/^\d*$/.test(val)){
                setValue(val === "" ? "" : Number(val)); 
              }
            } else {
              if ((type === "password" || type === "text") && e.target.value.length > 50) {
                setValue(e.target.value.slice(0, 50));
              } else {
                setValue(e.target.value);
              }
            }
          }}
          minLength={3}
          maxLength={50}
          onFocus={() => setInput(true)}
          onBlur={() => setInput(false)}
          type={type === "password" && showPassword ? "text" : type}
          // solo para desactivar modal de sugerencias
          inputMode={type === "number" ? "numeric" : undefined}
          autoComplete="one-time-code"
          name="custom-number"
        />

        {/* Botón de visibilidad solo si es password */}
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="p-2 border border-l-0 rounded-r-md bg-white hover:bg-gray-100 flex items-center justify-center"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};