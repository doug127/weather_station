import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/shared/hooks/AuthContext";
import { motion } from "framer-motion";
import { Img } from "../layouts/Img";
import { Input } from "@/shared/components/inputs/Input";
import { ToggleButton } from "../components/buttons/Button";
import { Button } from "@/shared/components/buttons/Button";
import { SkeletonPage } from "@/shared/components/skeletons/SkeletonPage";

export const Auth = () => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [optionForm, setOptionForm] = useState("Login");
  const [email, setEmail] = useState("");
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusIdentifier, setFocusIdentifier] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [focusPassword, setFocusPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [focusUsername, setFocusUsername] = useState(false);
  const [username, setUsername] = useState("");
  const [focusConfirmPassword, setFocusConfirmPassword] = useState(false);
  const [passwordConfirm, setConfirmPassword] = useState("");

  const { login, loading, error, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmitLogin = (e) => {
    e.preventDefault();
    login(identifier, password);
  };

  const onSubmitRegister = (e) => {
    e.preventDefault();
    register(username, email, password, passwordConfirm);
  }

  if(loading){
    return <SkeletonPage/>;
  }

  return (
    <div className="flex h-screen w-screen">
      {/* Left - Form */}
      <div className="relative flex flex-col justify-center items-center w-1/2 p-10">
        <ToggleButton option={optionForm} setOption={setOptionForm} />

        {/* Login Form */}
        <div className="mt-24 w-full flex justify-center">
          {optionForm === "Login" && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-full max-w-sm space-y-4"
            >
              {/* Username */}
              <Input
                label="Correo o Nombre de Usuario"
                value={identifier}
                setValue={setIdentifier}
                input={focusIdentifier}
                setInput={setFocusIdentifier}
                type="text"
                validationType="identifier"
              />

              {/* Password */}
              <Input
                label="Password"
                value={password}
                setValue={setPassword}
                input={focusPassword}
                setInput={setFocusPassword}
                type="password"
              />
              <Button
                type = "sumbit"
                onClick = {onSubmitLogin}
                variant = "primary"
                size = "full"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick= {() => navigate("/forgot-password")}
                variant = "none"
                size = "none"
              >
                ¿Olvidaste tu contraseña?
              </Button>
              
            </motion.div>
          )}

          {/* Register Form */}
          {optionForm === "Register" && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-full max-w-sm space-y-4"
            >
              <Input
                label="Username"
                value={username}
                setValue={setUsername}
                input={focusUsername}
                setInput={setFocusUsername}
                type="text"
                validationType="username"
              />

              <Input
                label="Email"
                value={email}
                setValue={setEmail}
                input={focusEmail}
                setInput={setFocusEmail}
                type="email"
                validationType="email"
              />

              <Input
                label="Password"
                value={password}
                setValue={setPassword}
                input={focusPassword}
                setInput={setFocusPassword}
                type="password"
                validationType="password"
              />

              <Input
                label="Confirm Password"
                value={passwordConfirm}
                setValue={setConfirmPassword}
                input={focusConfirmPassword}
                setInput={setFocusConfirmPassword}
                type="password"
                validationType="passwordConfirm"
                compareWith={password}
              />
              
              <Button
                type = "submit"
                onClick = {onSubmitRegister}
                size = "full"
              >
                Register  
              </Button> 

            </motion.div>
          )}
        </div>
      </div>

      {/* Right - Image */}
      <Img />
    </div>
  );
}
