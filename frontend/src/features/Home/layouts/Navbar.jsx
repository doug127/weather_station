import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "@/shared/api/contextProvider";
import { AuthContext } from "@/shared/hooks/AuthContext";
import { NavigationMap } from "@/features/Home/utils/NavigationMap";

export const Navbar = () => {
  const { isSidebarOpen, setIsSidebarOpen, currentArticle } = useContext(Context);
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();

  // 🔹 Buscar coincidencia con la ruta actual
  const currentRoute = Object.values(NavigationMap).find(
    (page) => page.path === location.pathname
  );

  // Si existe, extraemos su info
  const parent = currentRoute?.parent || "Clima";
  const label = currentRoute?.label || "Inicio";

  return (
    <nav className="w-full h-16 bg-white/80 backdrop-blur-md shadow-sm flex rounded-md px-4 z-40">
      <div className="w-full m-auto flex justify-between items-center">

        {/* Breadcrumb y botón de menú */}
        <div className="p-2 flex space-x-5 items-center">
          <i
            className="fa-solid fa-bars md:hidden sm:block cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          ></i>
          <p className="text-xs text-gray-700">
            {parent}
            {label && ` / ${label}`}
            {currentArticle && ` / ${currentArticle}`}
          </p>
        </div>

        {/* Usuario y logout */}
        <div>
          <ul className="flex space-x-4 items-center">
            <li className="hidden sm:block text-gray-700">
              Bienvenido, <span className="font-bold">{user?.username}</span>
            </li>

            <li
              onClick={logout}
              className="hover:bg-red-200 w-8 h-8 rounded-full flex justify-center items-center cursor-pointer"
            >
              <i className="fa-solid fa-sign-out-alt fa-lg"></i>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
