import { useState } from "react";
import { api } from "@/shared/api/apiRoutes"; 
import { useNavigate } from "react-router-dom";
import { Input } from "@/shared/components/inputs/Input";
import { AuthFormLayout } from "../layouts/AuthFormLayout";
import { Button } from "@/shared/components/buttons/Button";

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
      navigate("/reset-code");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error al solicitar recuperación");
    }
  };

  return (
      <AuthFormLayout
        title="Recuperar Contraseña"
      >
          <Input
            label="Correo electrónico"
            value={email}
            setValue={setEmail}
            input={focusEmail}
            setInput={setFocusEmail}
            type="email"
            validationType="email"
          />

          <Button 
            type="submit"
            size="full"
            variant="primary"
            onClick={onSubmitForgot}
          >
            Enviar código
          </Button>
          {message && <p className="text-red-500 text-sm">{message}</p>}
      </AuthFormLayout>
  );
};
