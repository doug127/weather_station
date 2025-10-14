export const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
}) => {
  const variants = {
    none: "text-sm font-medium md:font-normal text-blue-600 hover:underline mt-2",
    primary: "bg-gray-800 hover:bg-gray-700 text-white",
    secondary: "bg-gray-400 hover:bg-gray-500 text-gray-900",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-800 border border-gray-300",
  };

  const disabledVariants = {
    primary: "bg-gray-300 text-gray-500 cursor-not-allowed",
    secondary: "bg-gray-200 text-gray-400 cursor-not-allowed",
    danger: "bg-red-300 text-gray-100 cursor-not-allowed",
    ghost: "bg-gray-100 text-gray-400 cursor-not-allowed border",
    none: "text-gray-400 cursor-not-allowed md:font-normal xs:font-medium",
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

