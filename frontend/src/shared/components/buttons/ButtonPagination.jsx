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