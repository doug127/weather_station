import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Img } from '@/features/Auth/layouts/Img';
import { Input } from '@/shared/components/inputs/Input';
import { AuthContext } from '@/shared/hooks/AuthContext';
import { useTimer } from '@/shared/hooks/useTimer';

export const Validation = () => {
    const [code, setCode] = useState("");
    const [focusCode, setFocusCode] = useState(false);
    const navigate = useNavigate();

    const { verifyEmail, resendCode } = useContext(AuthContext);

    const email = localStorage.getItem("pendingEmail");
    const fromRegister = localStorage.getItem("fromRegister") === "true";
    const fromLogin = localStorage.getItem("fromLogin") === "true";


    const minutes = 15 * 60; 

    const {timeLeft, setTimeLeft, formattedTime} = useTimer(minutes);

    useEffect(() => {
        if (!email) {
            navigate("/auth");
        }
    }, [email, navigate]);

    const onSubmitValidation = async (e) => {
        e.preventDefault();
        
        if (!code) {
            alert("Por favor ingresa el código de verificación");
            return;
        }

        try {
            await verifyEmail(email, code, fromRegister);
        } catch (err) {
            console.error("Error en verificación:", err);
        }
    }

    const handleResend = async () => {
        try {
            await resendCode(email);
            setTimeLeft(minutes); 
        } catch (err) {
            console.error("No se pudo reenviar el código", err);
        }
    };

    return (
        <div className="flex h-screen w-screen">
            <div className="relative flex flex-col justify-center items-center w-1/2 p-10">
                <div className="absolute top-12 flex w-64 bg-gray-200 rounded-full p-2 justify-center">
                    <h1>Validar Email</h1>
                </div>
                <div className="mt-24 w-full flex justify-center">
                        <motion.div
                            initial={{ y: 200, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="w-full max-w-sm space-y-4"
                            >
                            <Input
                                label="Código de verificación"
                                value={code}
                                setValue={setCode}
                                input={focusCode}
                                setInput={setFocusCode}
                                type="number"
                            />

                            <button
                                className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700"
                                onClick={onSubmitValidation}
                            >
                                Verificar
                            </button>

                            <p className="text-center text-gray-600 mt-4">
                                Código expira en: {formattedTime}
                            </p>

                            {/* Botón de reenviar */}
                            <button
                                className={`w-full py-2 rounded-md mt-2 ${
                                    timeLeft > 0
                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-500"
                                }`}
                                disabled={timeLeft > 0}
                                onClick={handleResend}
                            >
                                Reenviar código
                            </button>
                        </motion.div>
                    </div>
            </div>
            <Img />
        </div>
    );
}