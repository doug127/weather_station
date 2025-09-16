import {motion} from "framer-motion";

export const ToggleButton = ({option, setOption}) => {


    return (
        <div className="absolute top-12 flex w-64 bg-gray-200 rounded-full p-1">
            <motion.div
            layout
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute top-1 bottom-1 w-1/2 bg-gray-900 rounded-full"
            style={{
                left: option === "Login" ? "0.25rem" : "calc(50% - 0.25rem)",
            }}
            />
            <button
            onClick={() => setOption("Login")}
            className={`relative z-10 w-1/2 text-center py-2 font-medium ${
                option === "Login" ? "text-white" : "text-gray-600"
            }`}
            >
            Login
            </button>
            <button
            onClick={() => setOption("Register")}
            className={`relative z-10 w-1/2 text-center py-2 font-medium ${
                option === "Register" ? "text-white" : "text-gray-600"
            }`}
            >
            Register
            </button>
        </div>
    );
}