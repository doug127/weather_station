import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/shared/hooks/AuthContext";
import { motion } from "framer-motion";
import { AuthFormLayout } from "../layouts/AuthFormLayout";
import { Input } from "@/shared/components/inputs/Input";
import { Button } from "@/shared/components/buttons/Button";
import { SkeletonPage } from "@/shared/components/skeletons/SkeletonPage";
import { api } from "@/shared/api/apiRoutes";
import Swal from "sweetalert2";

export const Auth = () => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [optionForm, setOptionForm] = useState("Ingresar");
  const [email, setEmail] = useState("");
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusIdentifier, setFocusIdentifier] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [focusPassword, setFocusPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [focusPasswordReg, setFocusPasswordReg] = useState(false);
  const [passwordReg, setPasswordReg] = useState("");
  const [focusUsername, setFocusUsername] = useState(false);
  const [username, setUsername] = useState("");
  const [focusConfirmPassword, setFocusConfirmPassword] = useState(false);
  const [passwordConfirm, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // Para registro de roles
  const [loader, setLoader] = useState(false);

  const { user, setUser, login, register, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setShowSkeleton(true);

    const skeletonTimer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1200);

    const checkSession = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        const user = res.data.user;

        if (user) {
          setUser(user);

          if (user.role_id !== "admin") {
            navigate("/Home", { replace: true });
            return; 
          }
        }
      } catch (err) {
        // No hay sesión activa
      }
    };

    checkSession();

    return () => clearTimeout(skeletonTimer);

  }, [navigate, setUser]);


  useEffect(() => {
    const showAlert = sessionStorage.getItem("showSuccessAlert");
    if (showAlert === "true") {
      sessionStorage.removeItem("showSuccessAlert"); // Limpiar inmediatamente
      
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido verificada correctamente. Ahora puedes iniciar sesión.',
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#111827', // bg-gray-900
      });
    }
  }, []);


  const onSubmitLogin = (e) => {
    e.preventDefault();
    login(identifier, password);
  };

  const onSubmitRegister = (e) => {
    e.preventDefault();
    register(username, email, passwordReg, passwordConfirm, role);
  };

  if (loading || showSkeleton) {
    return <SkeletonPage />;
  }


  return (
    <AuthFormLayout
      showToggle={true}
      optionForm={optionForm}
      setOptionForm={setOptionForm}
      leftOptionText="Ingresar"
      rightOptionText="Registrar"
    >
      {optionForm === "Ingresar" && (
        <motion.div 
          initial={{ x: 100, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.6, ease: "easeInOut" }} 
          className="w-full flex flex-col justify-evenly h-full space-y-6" 
        >
          <Input 
            label="Correo o Nombre de Usuario" 
            value={identifier} 
            setValue={setIdentifier} 
            input={focusIdentifier} 
            setInput={setFocusIdentifier} 
            type="text" 
            validationType="identifier" 
          />
          <Input 
            label="Contraseña" 
            value={password} 
            setValue={setPassword} 
            input={focusPassword} 
            setInput={setFocusPassword} 
            type="password" 
          />
          <Button 
            type="submit" 
            onClick={onSubmitLogin} 
            variant="primary" 
            size="full"
          >
              Iniciar sesión
          </Button>
          <Button 
            onClick={() => navigate("/forgot-password")}
            variant="none" 
            size="none" 
          > 
            ¿Olvidaste tu contraseña? 
          </Button>
        </motion.div>
      )}

      {optionForm === "Registrar" && (
        <motion.div 
          initial={{ x: -100, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ duration: 0.6, ease: "easeInOut" }} 
          className="w-full flex flex-col justify-evenly h-full space-y-4" 
        >
          <Input 
            label="Nombre de Usuario" 
            value={username} 
            setValue={setUsername} 
            input={focusUsername} 
            setInput={setFocusUsername} 
            type="text" 
            validationType="username" 
          /> 
          <Input 
            label="Correo Electrónico" 
            value={email} 
            setValue={setEmail} 
            input={focusEmail} 
            setInput={setFocusEmail} 
            type="email" 
            validationType="email" 
          /> 
          <Input 
            label="Contraseña" 
            value={passwordReg} 
            setValue={setPasswordReg} 
            input={focusPasswordReg} 
            setInput={setFocusPasswordReg} 
            type="password" 
            validationType="password" 
          /> 
          <Input 
            label="Confirmar Contraseña" 
            value={passwordConfirm} 
            setValue={setConfirmPassword} 
            input={focusConfirmPassword} 
            setInput={setFocusConfirmPassword} 
            type="password" 
            validationType="passwordConfirm" 
            compareWith={passwordReg} 
          /> 
          {user?.role_id === "admin" && ( 
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded" > 
              <option value="user">User</option> 
              <option value="admin">Admin</option> 
            </select> 
          )} 
          <Button 
            type="submit" 
            onClick={onSubmitRegister} 
            size="full" 
          > 
            Registrar 
          </Button>
        </motion.div>
      )}
    </AuthFormLayout>
  );
};