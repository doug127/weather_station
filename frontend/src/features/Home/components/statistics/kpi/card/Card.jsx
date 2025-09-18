export const Card = ({ icon, title, value }) => {
  return (
    <div className="bg-white w-72 rounded-md shadow-lg p-4 flex items-center gap-4">
      {/* Icono a la izquierda */}
      <div className="flex-shrink-0 text-white bg-gray-900 w-12 h-12 rounded-md flex justify-center items-center text-2xl">
        <i className={`fa-solid ${icon}`}></i>
      </div>

      {/* Información del sensor */}
      <div className="flex flex-col">
        <p className="text-gray-700 font-medium">{title}</p>
        <p className="text-2xl font-bold text-blue-600">{value}</p>
      </div>
    </div>
  );
};
