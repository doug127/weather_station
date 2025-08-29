import { useContext } from "react"
import { Context } from "@/shared/api/contextProvider"
import { AuthContext } from "@/shared/hooks/AuthContext";
import { NavigationMap } from "@/features/Home/utils/NavigationMap";

export const Navbar = () => {
    const { optionBanner, currentArticle } = useContext(Context);
    const current = NavigationMap[optionBanner];
    const parent = current.parent || "Estación Meteorológica";
    const label = current.label || "";
    const { logout } = useContext(AuthContext);

    return(
        <nav className="w-full h-16 bg-white/80 backdrop-blur-md shadow-sm flex rounded-md px-4 z-50">
            <div className="w-full m-auto flex justify-between">

                <div className="p-2">
                    <p className="text-xs">
                        {parent}
                        {label && ` / ${label}`}
                        {optionBanner === "Articles" && currentArticle && ` / ${currentArticle}`}
                    </p> 
                </div>

                <div className="h-full p-5">
                </div>
                <div className="">
                   <ul className="flex space-x-2 w-full h-full items-center">
                    <li className="hover:bg-gray-400 w-8 h-8 rounded-full flex justify-center items-center cursor-pointer"><i className="fa-solid fa-gear"></i></li>
                    <li className="hover:bg-gray-400 w-8 h-8 rounded-full flex justify-center items-center cursor-pointer"><i className="fa-solid fa-user"></i></li>
                    <li 
                    onClick={logout} 
                    className="hover:bg-gray-400 w-8 h-8 rounded-full flex justify-center items-center cursor-pointer">
                        <i className="fa-solid fa-sign-out-alt"></i>
                    </li>
                   </ul>
                </div>
            </div>
        </nav>
    )
}