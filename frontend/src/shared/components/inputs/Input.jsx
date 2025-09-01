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
  compareWith
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
        setError(emailRegex.test(value) ? "" : "Invalid email format.");
        break;
      }
      case "password": {
        const hasMayus = /[A-Z]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const hasNumber = /\d/.test(value);
        setError(
          !hasMayus || !hasSpecialChar || !hasNumber
            ? "Password must contain uppercase, special character, and number."
            : ""
        );
        break;
      }
      case "passwordConfirm": {
        setError(value !== compareWith ? "Passwords do not match." : "");
        break;
      }
      case "username": {
        setError(value.length < 3 ? "Username must be at least 3 characters." : "");
        break;
      }
      default:
        setError("");
    }
  }, [value, validationType, compareWith]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col relative w-full">
      <label
        className={`pointer-events-none absolute p-2 transition-[top,font-size] duration-200 ease-in-out h-5
          ${input || value ? "-top-4 text-xs left-2 bg-white" : "text-gray-400 left-2 top-0"}`}
      >
        {label}
      </label>

      <div className="flex w-full">
        <input
          className={`p-2 border outline-none w-full ${
            type === "password" ? "rounded-l-md" : "rounded-md"
          } ${value || input ? "border-1 border-gray-900" : "border-gray-200"}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setInput(true)}
          onBlur={() => setInput(false)}
          type={type === "password" && showPassword ? "text" : type}
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
