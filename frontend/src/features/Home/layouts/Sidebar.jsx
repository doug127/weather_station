import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useContext } from "react";
import { Context } from '../../../shared/api/contextProvider';
import { AuthContext } from "@/shared/hooks/AuthContext";
import { RequireRole } from '@/shared/components/role/RequireRole';
import { Footer } from "./Footer";
import { NavigationMap } from "../utils/NavigationMap";
import { AnimatePresence, motion } from "framer-motion";

export const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(Context);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationValues = Object.values(NavigationMap);

  return (
    <div className="flex w-max-[10vw] h-auto bg-gray-100 relative">
      {/* Sidebar fijo */}
      <div className="hidden md:block h-screen lg:w-[20vw] md:w-[15vw] px-3 py-4 sticky top-0 z-40">
        <div className="w-full h-full bg-white rounded-md shadow-lg border border-gray-300">
          <ul className="flex flex-col p-5 w-full justify-center space-y-2">
            {navigationValues.map((page) => {
              const fullPath = `/home/${page.path}`;
              return (
                <RequireRole key={page.path} minRole={page.role_id} user={user}>
                  <li
                    onClick={() => navigate(fullPath)}
                    className={`${
                      location.pathname === fullPath
                        ? "bg-gray-800 text-white shadow-lg"
                        : "hover:bg-gray-400 hover:text-white text-gray-400"
                    } transition duration-500 ease-in-out p-2 cursor-pointer rounded-md flex md:justify-center lg:justify-start items-center`}
                  >
                    <i className={`fa-solid fa-${page.icon} px-5`}></i>
                    <span className="md:hidden lg:block">{page.label}</span>
                  </li>
                </RequireRole>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Sidebar móvil */}
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
              {navigationValues.map((page) => {
                const fullPath = `/home/${page.path}`;
                return (
                  <RequireRole key={page.path} minRole={page.role_id} user={user}>
                    <li
                      onClick={() => {
                        navigate(fullPath);
                        setIsSidebarOpen(false);
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-200 rounded-md"
                    >
                      {page.label}
                    </li>
                  </RequireRole>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="w-full relative">
        <div className="sticky top-0 w-full z-40 p-4">
          <Navbar />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="p-6"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  );
};
