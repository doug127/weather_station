import { useContext } from "react"
import { Context } from "@/shared/api/contextProvider"
import { AuthContext } from "@/shared/hooks/AuthContext";
import { NavigationMap } from "@/features/Home/utils/NavigationMap";
import { RequireRole } from "@/shared/components/role/RequireRole";

export const Navbar = () => {
    const { optionBanner, currentArticle } = useContext(Context);
    const current = NavigationMap[optionBanner];
    const parent = current.parent;
    const label = current.label;
    const { logout, user } = useContext(AuthContext);
    const role_admin_id = 1;

    return(
        <nav className="w-full h-16 bg-white/80 backdrop-blur-md shadow-sm flex rounded-md px-4 z-50">
            <div className="w-full m-auto flex justify-between items-center">

                {/* Breadcrumb */}
                <div className="p-2">
                <p className="text-xs">
                    {parent}
                    {label && ` / ${label}`}
                    {optionBanner === "Articles" && currentArticle && ` / ${currentArticle}`}
                </p>
                </div>

                {/* Sección derecha */}
                <div>
                <ul className="flex space-x-4 items-center">
                    {/* Texto de bienvenida (oculto en móviles) */}
                    {/* <RequireRole roles={[role_admin_id]} user={user}> */}
                    <li className="hidden sm:block text-gray-700">
                        Bienvenido, <span className="font-bold">{user.username}</span>
                    </li>
                    {/* </RequireRole> */}

                    {/* Logout */}
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
    )
}