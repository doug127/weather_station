export const ButtonPagination = ({ children, onClick, disabled }) => {
    return (
        <button
            className={`px-3 py-1 text-sm rounded transition-colors ${
                disabled 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
            }`}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary", // primary | secondary | danger | ghost
  size = "md", // sm | md | lg | full
  className = "",
}) => {
  const variants = {
    none: "text-sm text-blue-600 hover:underline mt-2",
    primary: "bg-gray-800 hover:bg-gray-700 text-white",
    secondary: "bg-gray-300 hover:bg-gray-400 text-gray-900",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-800 border border-gray-300",
  };

  const disabledVariants = {
    primary: "bg-gray-300 text-gray-500 cursor-not-allowed",
    secondary: "bg-gray-200 text-gray-400 cursor-not-allowed",
    danger: "bg-red-300 text-gray-100 cursor-not-allowed",
    ghost: "bg-gray-100 text-gray-400 cursor-not-allowed border",
    none: "text-gray-400 cursor-not-allowed",
  };

  const sizes = {
    none: "text-sm py-1",
    sm: "px-3 py-1 text-sm rounded-md",
    md: "px-4 py-2 rounded-md",
    lg: "px-6 py-3 rounded-lg text-lg",
    full: "w-full py-2 rounded-md",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${disabled ? disabledVariants[variant] : variants[variant]}
        ${sizes[size]}
        transition duration-300 ease-in-out
        ${className}
      `}
    >
      {children}
    </button>
  );
};

import {motion} from "framer-motion";

export const ToggleButton = ({option, setOption, leftOption, rightOption, className=""}) => {

    return (
        <div className={`absolute top-12 flex w-64 bg-gray-200 rounded-full p-1 ${className}`}>
            <motion.div
            layout
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute top-1 bottom-1 w-1/2 bg-gray-900 rounded-full"
            style={{
                left: option === `${leftOption}` ? "0.25rem" : "calc(50% - 0.25rem)",
            }}
            />
            <button
            onClick={() => setOption(`${leftOption}`)}
            className={`relative z-10 w-1/2 text-center py-2 font-medium ${
                option === `${leftOption}` ? "text-white" : "text-gray-600"
            }`}
            >
            {leftOption}
            </button>
            <button
            onClick={() => setOption(`${rightOption}`)}
            className={`relative z-10 w-1/2 text-center py-2 font-medium ${
                option === `${rightOption}` ? "text-white" : "text-gray-600"
            }`}
            >
            {rightOption}
            </button>
        </div>
    );
}
