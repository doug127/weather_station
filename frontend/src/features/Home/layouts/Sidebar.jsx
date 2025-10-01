// Sidebar.jsx
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useContext } from "react";
import { Context } from '../../../shared/api/contextProvider';
import { AuthContext } from "@/shared/hooks/AuthContext";
import { RequireRole } from '@/shared/components/role/RequireRole';
import { Footer } from "./Footer";

export const Sidebar = () => {
  const { optionBanner, setOptionBanner, isSidebarOpen, setIsSidebarOpen } = useContext(Context);
  const { user } = useContext(AuthContext);
  const ROLE_SUPERADMIN = 1;
  const ROLE_ADMIN = 2;

  return (
    <div className="flex w-max-[10vw] h-auto bg-gray-100 relative">

      {/* Sidebar fijo para md+ */}
      <div className="hidden md:block h-screen lg:w-[20vw] md:w-[15vw] px-3 py-4 sticky top-0 z-40">
        <div className="w-full h-full bg-white rounded-md shadow-lg border border-gray-300">
          <div className="flex justify-center items-center p-5">
            <p className="md:hidden">Estación Meteorológica</p>
          </div>
          <div>
            <ul className="flex flex-col p-5 w-full justify-center space-y-2">
              <li onClick={() => setOptionBanner("Init")} className={`${
                optionBanner === "Init"
                  ? "sm:justify-center md:justify-start md:items-center bg-gray-800 text-white shadow-lg cursor-pointer"
                  : "sm:justify-center md:justify-start md:items-center hover:bg-gray-400 hover:text-white text-gray-400 "
              } transition duration-500 ease-in-out p-2 cursor-pointer rounded-md flex`}>
                <i className="fa-solid fa-house px-5"></i>
                <span className="md:hidden lg:block">Reseña Histórica</span>
              </li>
              <li onClick={() => setOptionBanner("Articles")} className={`${
                optionBanner === "Articles"
                  ? "sm:justify-center md:justify-start md:items-center bg-gray-800 text-white shadow-lg cursor-pointer"
                  : "sm:justify-center md:justify-start md:items-center hover:bg-gray-400 hover:text-white text-gray-400 "
              } transition duration-500 ease-in-out p-2 cursor-pointer rounded-md flex`}>
                <i className="fa-solid fa-newspaper px-5"></i>
                <span className="md:hidden lg:block">Artículos</span>
              </li>
              <li onClick={() => setOptionBanner("Statistics")} className={`${
                optionBanner === "Statistics"
                  ? "sm:justify-center md:justify-start md:items-center bg-gray-800 text-white shadow-lg cursor-pointer"
                  : "sm:justify-center md:justify-start md:items-center hover:bg-gray-400 hover:text-white text-gray-400 "
              } transition duration-500 ease-in-out p-2 cursor-pointer rounded-md flex`}>
                <i className="fa-solid fa-chart-column px-5"></i>
                <span className="md:hidden lg:block">Estadísticas</span>
              </li>
              <li onClick={() => setOptionBanner("Tables")} className={`${
                optionBanner === "Tables"
                  ? "sm:justify-center md:justify-start md:items-center bg-gray-800 text-white shadow-lg cursor-pointer"
                  : "sm:justify-center md:justify-start md:items-center hover:bg-gray-400 hover:text-white text-gray-400 "
              } transition duration-500 ease-in-out p-2 cursor-pointer rounded-md flex`}>
                <i className="fa-solid fa-table px-5"></i>
                <span className="md:hidden lg:block">Tablas</span>
              </li>
              <RequireRole roles={[ROLE_ADMIN, ROLE_SUPERADMIN]} user={user}>
                <li onClick={() => setOptionBanner("AddSensor")} className={`${
                  optionBanner === "AddSensor"
                    ? "sm:justify-center md:justify-start md:items-center bg-gray-800 text-white shadow-lg cursor-pointer"
                    : "sm:justify-center md:justify-start md:items-center hover:bg-gray-400 hover:text-white text-gray-400 "
                } transition duration-500 ease-in-out p-2 cursor-pointer rounded-md flex`}>
                  <i className="fa-solid fa-chart-line px-5"></i>
                  <span className="md:hidden lg:block">Registrar sensor</span>
                </li>
                <li onClick={() => setOptionBanner("AddValues")} className={`${
                  optionBanner === "AddValues"
                    ? "sm:justify-center md:justify-start md:items-center bg-gray-800 text-white shadow-lg cursor-pointer"
                    : "sm:justify-center md:justify-start md:items-center hover:bg-gray-400 hover:text-white text-gray-400 "
                } transition duration-500 ease-in-out p-2 cursor-pointer rounded-md flex`}>
                  <i className="fa-solid fa-chart-simple px-5"></i>
                  <span className="md:hidden lg:block">Registrar valores</span>
                </li>
              </RequireRole>
              <li onClick={() => setOptionBanner("User")} className={`${
                optionBanner === "User"
                  ? "sm:justify-center md:justify-start md:items-center bg-gray-800 text-white shadow-lg cursor-pointer"
                  : "sm:justify-center md:justify-start md:items-center hover:bg-gray-400 hover:text-white text-gray-400 "
              } transition duration-500 ease-in-out p-2 cursor-pointer rounded-md flex`}>
                <i className="fa-solid fa-user px-5"></i>
                <span className="md:hidden lg:block">Perfil</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sidebar overlay para sm (sobre navbar) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 md:hidden flex"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div 
            className="w-64 bg-white h-full shadow-lg p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="flex flex-col space-y-2">
              <li onClick={() => { setOptionBanner("Init"); setIsSidebarOpen(false); }} className="p-2 cursor-pointer hover:bg-gray-200 rounded-md">
                Reseña Histórica
              </li>
              <li onClick={() => { setOptionBanner("Articles"); setIsSidebarOpen(false); }} className="p-2 cursor-pointer hover:bg-gray-200 rounded-md">
                Artículos
              </li>
              <li onClick={() => { setOptionBanner("Statistics"); setIsSidebarOpen(false); }} className="p-2 cursor-pointer hover:bg-gray-200 rounded-md">
                Estadísticas
              </li>
              <li onClick={() => { setOptionBanner("Tables"); setIsSidebarOpen(false); }} className="p-2 cursor-pointer hover:bg-gray-200 rounded-md">
                Tablas
              </li>
              <RequireRole roles={[ROLE_ADMIN, ROLE_SUPERADMIN]} user={user}>
                <li onClick={() => { setOptionBanner("AddSensor"); setIsSidebarOpen(false); }} className="p-2 cursor-pointer hover:bg-gray-200 rounded-md">
                  Registrar Sensor
                </li>
                <li onClick={() => { setOptionBanner("AddValues"); setIsSidebarOpen(false); }} className="p-2 cursor-pointer hover:bg-gray-200 rounded-md">
                  Registrar Valores
                </li>
              </RequireRole>
              <li onClick={() => { setOptionBanner("User"); setIsSidebarOpen(false); }} className="p-2 cursor-pointer hover:bg-gray-200 rounded-md">
                Perfil
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="w-full relative">
        <div className="sticky top-0 w-full z-40 p-4">
          <Navbar />
        </div>

        <Outlet />
        <Footer />
      </div>
    </div>
  );
};
