import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "@/shared/hooks/AuthContext";

export const User = () => {
  const { user, updateUsername, passwordRecovery, resetPassword } = useContext(AuthContext);

  const [openAccordion, setOpenAccordion] = useState(null);
  const [newUsername, setNewUsername] = useState("");

  const [step, setStep] = useState("email"); // email | code | success
  const [email, setEmail] = useState(user?.email || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    try {
      const msg = await updateUsername(newUsername);
      setMessage(msg);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestRecovery = async (e) => {
    e.preventDefault();
    try {
      const msg = await passwordRecovery(email);
      setMessage(msg);
      setStep("code");
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const msg = await resetPassword(email, code, password, passwordConfirm);
      setMessage(msg);
      setStep("success");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="landing flex flex-col items-center min-h-screen p-4 space-y-6">
      <h1 className="text-2xl font-bold">Opciones de Usuario</h1>
      
      {/* Accordion - Cambiar Username */}
      <div className="w-full max-w-md border rounded-lg shadow p-4">
        <button
          className="w-full text-left font-semibold text-lg"
          onClick={() => setOpenAccordion(openAccordion === "username" ? null : "username")}
        >
          Cambiar Nombre de Usuario
        </button>
        <AnimatePresence>
          {openAccordion === "username" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4"
            >
              <form onSubmit={handleUsernameChange} className="space-y-3">
                <input
                  type="text"
                  placeholder="Nuevo nombre de usuario"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      

      {message && <p className="text-sm text-blue-600">{message}</p>}
    </div>
  );
};
