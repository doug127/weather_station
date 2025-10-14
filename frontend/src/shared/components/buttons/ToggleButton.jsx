import {motion} from "framer-motion";

export const ToggleButton = ({option, setOption, leftOption, rightOption, className=""}) => {
    return (
        <div className={`relative lg:absolute lg:top-12 flex w-full lg:w-64 bg-gray-200 rounded-full p-1 mb-6 lg:mb-0 ${className}`}>
            <motion.div
            layout
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute h-[calc(100%-0.5rem)] top-1 w-[calc(50%)] bg-gray-900 rounded-full"
            style={{
                left: option === `${leftOption}` ? "0.25rem" : "calc(50% - 0.25rem)",
            }}
            />
            <button
            onClick={() => setOption(`${leftOption}`)}
            className={`relative z-10 w-1/2 text-center py-2 font-medium transition-colors ${
                option === `${leftOption}` ? "text-white" : "text-gray-600"
            }`}
            >
            {leftOption}
            </button>
            <button
            onClick={() => setOption(`${rightOption}`)}
            className={`relative z-10 w-1/2 text-center py-2 font-medium transition-colors ${
                option === `${rightOption}` ? "text-white" : "text-gray-600"
            }`}
            >
            {rightOption}
            </button>
        </div>
    );
}