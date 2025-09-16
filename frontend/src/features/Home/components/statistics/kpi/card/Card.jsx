<<<<<<< HEAD
export const Card = ({ icon, title, value, percentage }) => {
    return (
        <div className="bg-white w-72 rounded-md shadow-lg">
            <div className="w-full flex justify-between border-b border-gray-200">
                <div className="p-4"><i className={`fa-solid ${icon} text-2xl bg-gray-900 w-12 h-12 rounded-md flex justify-center items-center text-white`}></i> </div>
                <div className="px-5 p-2">
                    <p>${title}</p>
                    <h1 className="text-3xl font-bold">${value}</h1>
                </div>
            </div>
                <div className="px-2 py-4">
                    <p><span className="font-bold text-green-500">+${percentage} </span> tha last week</p>
                </div>
        </div>
    );
}
=======
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
>>>>>>> ms
