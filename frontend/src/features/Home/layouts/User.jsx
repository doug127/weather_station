import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "@/shared/hooks/AuthContext";
import { RequireRole } from '@/shared/components/role/RequireRole'
import { api } from "@/shared/api/apiRoutes";

export const User = () => {
  const { user, updateUsername, passwordRecovery, resetPassword } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState([]);
  const [roleChanges, setRoleChanges] = useState({}); // { userId: newRoleId }
  const ROLE_SUPERADMIN = 1;
  const ROLE_ADMIN = 2;
  const ROLE_USER = 3;

  const [openAccordion, setOpenAccordion] = useState(null);
  const [newUsername, setNewUsername] = useState("");

  const [step, setStep] = useState("email"); // email | code | success
  const [email, setEmail] = useState(user?.email || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user"); // endpoint que devuelva todos los usuarios
        // 🔹 Accedemos al array de usuarios
        const usersArray = res.data.users;

        // Filtramos para excluir superadmin
        const filtered = usersArray.filter(u => u.role_id !== ROLE_SUPERADMIN);
        setAllUsers(filtered);

        // Inicializamos roleChanges
        const initialRoles = {};
        filtered.forEach(u => { initialRoles[u.id] = u.role_id });
        setRoleChanges(initialRoles);
      } catch (err) {
        console.error(err);
      }
    };

    if (user.role_id === ROLE_SUPERADMIN) {
      fetchUsers();
    }
  }, [user]);

  const handleRoleToggle = (userId, newRole) => {
    setRoleChanges(prev => ({ ...prev, [userId]: newRole }));
  };

  const handleSaveRoles = async () => {
    try {
      await api.put("/user/update-roles", { roles: roleChanges });
      alert("Roles actualizados correctamente!");
      // Opcional: volver a traer usuarios para refrescar estado
    } catch (err) {
      console.error(err);
      alert("Error al actualizar roles");
    }
  };

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

      {/* 🔹 Accordion SuperAdmin - Gestionar roles */}
      <RequireRole roles={[ROLE_SUPERADMIN]} user={user}>
        <div className="w-full max-w-md border rounded-lg shadow p-4">
          <button
            className="w-full text-left font-semibold text-lg"
            onClick={() => setOpenAccordion(openAccordion === "roles" ? null : "roles")}
          >
            Gestionar Roles de Usuarios
          </button>
          <AnimatePresence>
            {openAccordion === "roles" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4 space-y-3"
              >
                {allUsers.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{u.username}</span>
                    <select
                      value={roleChanges[u.id]}
                      onChange={(e) => handleRoleToggle(u.id, Number(e.target.value))}
                      className="p-1 border rounded"
                    >
                      <option value={ROLE_USER}>User</option>
                      <option value={ROLE_ADMIN}>Admin</option>
                    </select>
                  </div>
                ))}

                <button
                  onClick={handleSaveRoles}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-2"
                >
                  Guardar Cambios
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </RequireRole>

      {message && <p className="text-sm text-blue-600">{message}</p>}
    </div>
  );
};
