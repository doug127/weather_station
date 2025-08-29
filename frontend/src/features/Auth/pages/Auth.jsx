import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/shared/components/inputs/Input";
import { api } from "@/shared/api/apiRoutes";
import { ToggleButton } from "../components/buttons/Button";
import { Img } from "../layouts/Img";
import { AuthContext } from "../../../shared/hooks/AuthContext";
// import { useAuth } from "../hooks/useAuth";

export const Auth = () => {
  const [optionForm, setOptionForm] = useState("Login");

  // Estado para inputs de ejemplo
  const [focusEmail, setFocusEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [focusPassword, setFocusPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [focusName, setFocusName] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [focusUsername, setFocusUsername] = useState(false);

  const { login, loading, error } = useContext(AuthContext);

  const onSubmitLogin = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Left - Form */}
      <div className="relative flex flex-col justify-center items-center w-1/2 p-10">
        {/* Botones toggle */}
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
                label="Username"
                value={username}
                setValue={setUsername}
                input={focusUsername}
                setInput={setFocusUsername}
                type="text"
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
              <button 
              className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700"
              type="submit"
              onClick={onSubmitLogin}
              >
                Login
              </button>
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
              {/* Name */}
              <Input
                label="Name"
                value={name}
                setValue={setName}
                input={focusName}
                setInput={setFocusName}
                type="text"
              />

              {/* Email */}
              <Input
                label="Email"
                value={email}
                setValue={setEmail}
                input={focusEmail}
                setInput={setFocusEmail}
                type="email"
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
              <button className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700">
                Register
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Right - Image */}
      <Img />
    </div>
  );
}
