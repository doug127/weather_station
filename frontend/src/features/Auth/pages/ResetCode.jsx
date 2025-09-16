import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Input } from "@/shared/components/inputs/Input"
import { Img } from "../layouts/Img"
import { AuthContext } from "@/shared/hooks/AuthContext";

export const ResetCode = () => {
  const [code, setCode] = useState("");
  const [focusCode, setFocusCode] = useState(false);
  const [password, setPassword] = useState("");
  const [focusPassword, setFocusPassword] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [focusConfirmPassword, setFocusConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { resetPassword } = useContext(AuthContext);

  const email = localStorage.getItem("recoveryEmail");

  const onSubmitReset = async (e) => {
    e.preventDefault();
    const message = await resetPassword(email, code, password, passwordConfirm);
    alert(message || "Contraseña cambiada exitosamente");
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
          <h2 className="text-xl font-bold text-center">Restablecer contraseña</h2>

          <Input label="Código" value={code} setValue={setCode} type="number" input={focusCode} setInput={setFocusCode}/>
          <Input label="Nueva contraseña" value={password} setValue={setPassword} type="password" input={focusPassword} setInput={setFocusPassword}/>
          <Input label="Confirmar contraseña" value={passwordConfirm} setValue={setPasswordConfirm} type="password" input={focusConfirmPassword} setInput={setFocusConfirmPassword}/>

          <button
            className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700"
            type="submit"
            onClick={onSubmitReset}
          >
            Cambiar contraseña
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </motion.div>
      </div>
      
        <Img/>
    </div>
  );
};
