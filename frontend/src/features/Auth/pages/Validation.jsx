import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthFormLayout } from '@/features/Auth/layouts/AuthFormLayout';
import { Input } from '@/shared/components/inputs/Input';
import { AuthContext } from '@/shared/hooks/AuthContext';
import { useTimer } from '@/shared/hooks/useTimer';
import { Button } from '@/shared/components/buttons/Button';

export const Validation = () => {
    const [code, setCode] = useState("");
    const [focusCode, setFocusCode] = useState(false);
    const navigate = useNavigate();

    const { verifyEmail, resendCode } = useContext(AuthContext);

    // 👇 Cambiar a sessionStorage
    const email = sessionStorage.getItem("pendingEmail");
    const fromRegister = sessionStorage.getItem("fromRegister") === "true";
    const fromLogin = sessionStorage.getItem("fromLogin") === "true";

    const minutes = 15 * 1; 
    const {timeLeft, setTimeLeft, formattedTime} = useTimer(minutes);

    useEffect(() => {
        // Limpiar skipSessionCheck cuando el componente se monta
        sessionStorage.removeItem("skipSessionCheck");
        
        if (!email) {
            console.log("❌ No hay email pendiente, redirigiendo a /auth");
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
        <AuthFormLayout
            title = "Validar Correo Electrónico" 
        >
            <Input
                label="Código de verificación"
                value={code}
                setValue={setCode}
                input={focusCode}
                setInput={setFocusCode}
                type="number"
            />

            <Button
                className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700"
                onClick={onSubmitValidation}
            >
                Verificar
            </Button>

            <p className="text-center text-gray-600 mt-4">
                Código expira en: {formattedTime}
            </p>

            <Button
                // className={`w-full py-2 rounded-md mt-2 ${
                //     timeLeft > 0
                //         ? "bg-gray-400 text-white cursor-not-allowed"
                //         : "bg-blue-600 text-white hover:bg-blue-500"
                // }`}
                size="full"
                variant={`${
                    timeLeft > 0
                        ? "ghost"
                        : "secondary"
                }`}
                disabled={timeLeft > 0}
                onClick={handleResend}
            >
                Reenviar código
            </Button>
        </AuthFormLayout>
    );
}