import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/shared/components/inputs/Input"
import { Button } from "@/shared/components/buttons/Button"
import { AuthContext } from "@/shared/hooks/AuthContext";
import { AuthFormLayout } from "../layouts/AuthFormLayout";

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
    <AuthFormLayout
      title="Restablecer Contraseña"
    >
          <Input 
            label="Código" 
            value={code} 
            setValue={setCode} 
            type="number" 
            input={focusCode} 
            setInput={setFocusCode}
          />
          <Input 
            label="Nueva contraseña" 
            value={password} 
            setValue={setPassword} 
            type="password" 
            input={focusPassword} 
            setInput={setFocusPassword}
            validationType="password"
          />
          <Input 
            label="Confirmar contraseña" 
            value={passwordConfirm} 
            setValue={setPasswordConfirm} 
            type="password" 
            input={focusConfirmPassword} 
            setInput={setFocusConfirmPassword}
            validationType="passwordConfirm"
            compareWith={password}
          />

          <Button
            variant="primary"
            size="full"
            type="submit"
            onClick={onSubmitReset}
          >
            Cambiar contraseña
          </Button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
    </AuthFormLayout>
  );
};
