export const Card = ({ icon, title, value }) => {
  const icons = "fa-solid fa-chart-gantt"; 
  return (
    <div className="bg-gray-100 rounded-md shadow-md border p-4 flex items-center gap-4 w-full">
      {/* Icono */}
      <div className="flex-shrink-0 text-white bg-blue-800 w-12 h-12 rounded-md flex justify-center items-center text-2xl">
        <i className={`fa-solid ${icon}`}></i>
      </div>

      {/* Información */}
      <div className="flex flex-col">
        <p className="text-gray-900 font-medium text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-600">{value}</p>
      </div>
    </div>

  );
};
