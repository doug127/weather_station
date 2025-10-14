import { motion } from 'framer-motion';
import { Img } from './Img'
import { ToggleButton } from '@/shared/components/buttons/ToggleButton';

export const AuthFormLayout = (
{ 
    children, 
    showToggle = false, 
    leftOptionText, 
    rightOptionText, 
    optionForm, 
    setOptionForm, 
    title = "" 
}) => {

    return (
        <div className="relative flex lg:flex-row min-h-screen w-screen overflow-y-auto lg:overflow-visible">
            {/* Contenedor del formulario */}
            <div className="absolute lg:relative inset-0 lg:inset-auto flex flex-col justify-center items-center sm:w-full lg:w-1/2 p-6 lg:p-10 z-10">
                <div className="w-full max-w-sm bg-white/70 lg:bg-transparent backdrop-blur-none sm:backdrop-blur-none rounded-3xl lg:rounded-none shadow-2xl lg:shadow-none p-8 lg:p-0 flex flex-col min-h-[500px] lg:min-h-[550px]">

                <div className="w-full flex flex-col items-center mb-6">
                    {title && (
                        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">{title}</h1>
                    )}

                    {showToggle && (
                        <ToggleButton
                        option={optionForm}
                        setOption={setOptionForm}
                        leftOption={leftOptionText}
                        rightOption={rightOptionText}
                        />
                    )}
                </div>
                
                {/* Contenedor de formulario animado */}
                <div className="w-full flex justify-center items-center flex-1">
                    <div className="w-full flex items-center justify-center">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="w-full flex flex-col justify-evenly space-y-4"
                    >   
                        
                        {children}
                    </motion.div>
                    </div>
                </div>
                </div>
            </div>

            <Img />
        </div>
    );
};