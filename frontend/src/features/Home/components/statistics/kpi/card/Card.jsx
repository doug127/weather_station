export const Card = ({ icon, title, value }) => {
  const icons = "fa-solid fa-chart-gantt"; 
  return (
    <div className="bg-gray-100 lg:w-72 rounded-md shadow-md border p-4 flex items-center gap-4 md:flex md:justify-center md:items-center md:w-full">
      {/* Icono a la izquierda */}
      <div className="flex-shrink-0 text-white bg-blue-800 w-12 h-12 rounded-md flex justify-center items-center text-2xl">
        <i className={`fa-solid ${icon}`}></i>
      </div>

      {/* Información del sensor */}
      <div className="flex flex-col">
        {console.log(value)}
        <p className="text-gray-900 font-medium text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-600">{value}
        </p>
        <p className="text-xl"></p>
      </div>
    </div>
  );
};
