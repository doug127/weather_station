export const ButtonPagination = ({ children, onClick, currentPage, totalPages }) => {
    return (
        <button
            className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
            onClick={onClick}
            disabled={currentPage === totalPages}
        >
            {children}
        </button>
    );
};
