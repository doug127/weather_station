import {motion} from "framer-motion";

export const ToggleButton = ({option, setOption, leftOption, rightOption}) => {


    return (
        <div className="absolute top-12 flex w-64 bg-gray-200 rounded-full p-1">
            <motion.div
            layout
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute top-1 bottom-1 w-1/2 bg-gray-900 rounded-full"
            style={{
                left: option === `${leftOption}` ? "0.25rem" : "calc(50% - 0.25rem)",
            }}
            />
            <button
            onClick={() => setOption(`${leftOption}`)}
            className={`relative z-10 w-1/2 text-center py-2 font-medium ${
                option === `${leftOption}` ? "text-white" : "text-gray-600"
            }`}
            >
            {leftOption}
            </button>
            <button
            onClick={() => setOption(`${rightOption}`)}
            className={`relative z-10 w-1/2 text-center py-2 font-medium ${
                option === `${rightOption}` ? "text-white" : "text-gray-600"
            }`}
            >
            {rightOption}
            </button>
        </div>
    );
}