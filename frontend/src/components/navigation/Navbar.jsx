import { useContext } from "react"
import { Context } from "../../api/contextProvider"

export const Navbar = () => {
    const { optionBanner } = useContext(Context);
    return(
        <nav className="w-full h-16 bg-white/80 backdrop-blur-md shadow-sm flex rounded-md px-4 z-50">
            <div className="w-full m-auto flex justify-between">

                <div className="p-2">
                    <p className="text-xs">
                        <span className="text-gray-400">Clima</span> / {optionBanner === 'Statistics' ? 'Estadisticas' : optionBanner === 'Tables' && 'Tablas'}
                    </p> 
                    <h1 className="font-bold">
                        Inicio
                    </h1>
                </div>

                <div className="h-full p-5">
                </div>
                <div className="">
                   <ul className="flex space-x-2 w-full h-full items-center">
                    <li className="hover:bg-gray-400 w-8 h-8 rounded-full flex justify-center items-center cursor-pointer"><i className="fa-solid fa-gear"></i></li>
                    <li className="hover:bg-gray-400 w-8 h-8 rounded-full flex justify-center items-center cursor-pointer"><i className="fa-solid fa-bell"></i></li>
                   </ul>
                </div>
            </div>
        </nav>
    )
}