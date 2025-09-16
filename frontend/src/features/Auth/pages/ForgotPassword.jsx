import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/shared/api/apiRoutes"; 
import { useNavigate } from "react-router-dom";
import { Input } from "@/shared/components/inputs/Input";
import { Img } from "../layouts/Img";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [focusEmail, setFocusEmail] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmitForgot = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/password-recovery", { email });
      localStorage.setItem("recoveryEmail", email);
      navigate("/reset-code"); // siguiente paso
    } catch (err) {
      setMessage(err.response?.data?.message || "Error al solicitar recuperación");
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="flex flex-col justify-center items-center w-1/2 p-10">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm space-y-4"
        >
          <h2 className="text-xl font-bold text-center">Recuperar contraseña</h2>

          <Input
            label="Correo electrónico"
            value={email}
            setValue={setEmail}
            input={focusEmail}
            setInput={setFocusEmail}
            type="email"
          />

          <button
            className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700"
            onClick={onSubmitForgot}
          >
            Enviar código
          </button>

          {message && <p className="text-red-500 text-sm">{message}</p>}
        </motion.div>
      </div>

      <Img/>
    </div>
  );
};
