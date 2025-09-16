import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useContext } from "react";
import { Context } from '@/shared/api/contextProvider';
import { AuthContext } from "@/shared/hooks/AuthContext";
import { RequireRole } from '@/shared/components/role/RequireRole'
import { Footer } from "./Footer";

export const Sidebar = () => {
  const { optionBanner, setOptionBanner } = useContext(Context);
  const { user } = useContext(AuthContext);
  const role_admin_id = 1;

  return (
    <div className="flex h-auto bg-gray-100">
      {/* Sidebar */}
      <div className="h-screen w-[360px] px-3 py-4 sticky top-0 z-10">
        <div className="w-full h-full bg-white rounded-md shadow-lg border border-gray-300">
          <div className="flex justify-center items-center p-5">
            <p>Estación Meteorológica</p>
          </div>
          <div>
            <ul className="flex flex-col p-5 w-full justify-center space-y-2">
              <li
                onClick={() => setOptionBanner("Init")}
                className={`${
                  optionBanner === "Init"
                    ? "bg-gray-800 text-white shadow-lg cursor-pointer"
                    : "hover:bg-gray-400 hover:text-white text-gray-400 "
                } transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}
              >
                <i className="fa-solid fa-house px-5"></i>
                Reseña Histórica
              </li>
              <li
                onClick={() => setOptionBanner("Articles")}
                className={`${
                  optionBanner === "Articles"
                    ? "bg-gray-800 text-white shadow-lg cursor-pointer"
                    : "hover:bg-gray-400 hover:text-white text-gray-400 "
                } transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}
              >
                <i className="fa-solid fa-newspaper px-5"></i>
                Artículos
              </li>
              <li
                onClick={() => setOptionBanner("Statistics")}
                className={`${
                  optionBanner === "Statistics"
                    ? "bg-gray-800 text-white shadow-lg cursor-pointer"
                    : "hover:bg-gray-400 hover:text-white text-gray-400 "
                } transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}
              >
                <i className="fa-solid fa-chart-column px-5"></i>
                Estadisticas
              </li>
              <li
                onClick={() => setOptionBanner("Tables")}
                className={`${
                  optionBanner === "Tables"
                    ? "bg-gray-800 text-white shadow-lg cursor-pointer"
                    : "hover:bg-gray-400 hover:text-white text-gray-400 "
                } transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}
              >
                <i className="fa-solid fa-table px-5"></i>
                Tablas
              </li>
              <RequireRole roles={[role_admin_id]} user={user}>
                <li
                  onClick={() => setOptionBanner("AddSensor")}
                  className={`${
                    optionBanner === "AddSensor"
                      ? "bg-gray-800 text-white shadow-lg cursor-pointer"
                      : "hover:bg-gray-400 hover:text-white text-gray-400 "
                  } transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}
                >
                  <i className="fa-solid fa-chart-line px-5"></i>
                  Registrar sensor
                </li>
                <li
                  onClick={() => setOptionBanner("AddValues")}
                  className={`${
                    optionBanner === "AddValues"
                      ? "bg-gray-800 text-white shadow-lg cursor-pointer"
                      : "hover:bg-gray-400 hover:text-white text-gray-400 "
                  } transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}
                >
                  <i className="fa-solid fa-chart-simple px-5"></i>
                  Registrar valores
                </li>
              </RequireRole>
                <li
                    onClick={() => setOptionBanner("User")}
                    className={`${
                    optionBanner === "User"
                    ? "bg-gray-800 text-white shadow-lg cursor-pointer"
                    : "hover:bg-gray-400 hover:text-white text-gray-400 "
                    } transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}
                    >
                    <i className="fa-solid fa-user px-5"></i>
                    Perfil
                </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full">
        <div className="sticky top-0 w-full z-50 p-4">
          <Navbar />
        </div>

        {/* Aquí se inyectan dinámicamente las páginas */}
        <Outlet />

        <Footer />
      </div>
    </div>
  );
};