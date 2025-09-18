import { createContext, useState, useEffect, useContext } from "react";
import { api } from '../api/apiRoutes';
import { useNavigate } from "react-router-dom";
import { Context } from "../api/contextProvider";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setOptionBanner } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {

            try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    const res = await api.get("/auth/me", { withCredentials: true });
                    setUser(res.data.user);
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                }
            } catch (error) {
                setUser(null);
                localStorage.removeItem("user");
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    const login = async (identifier, password) => {
        try {
            setLoading(true);
            setError(null);

            // Login
            await api.post("/auth/login", { identifier, password }, { withCredentials: true });
            
            // Obtener info del usuario
            const res = await api.get("/auth/me", { withCredentials: true });
            const userData = res.data.user;
            if (!userData) throw new Error("No se pudo obtener la información del usuario");

            if (!userData.isVerified) {
                // Guardar email pendiente
                localStorage.setItem("pendingEmail", userData.email);
                localStorage.setItem("fromLogin", "true");
                localStorage.setItem("fromRegister", "false");

                // Enviar código automáticamente al email
                try {
                    await api.post("/auth/resend-code", { email: userData.email });
                    console.log("Código de verificación enviado al correo automáticamente.");
                } catch (err) {
                    console.error("Error enviando el código automáticamente:", err);
                }

                navigate("/verify-email");
                return;
            }

            // Usuario verificado: setear sesión
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            navigate("/home");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {        
        try {
            await api.post("/auth/logout", {}, { withCredentials: true});
            setUser(null);
            setOptionBanner('Init');
            localStorage.removeItem("user");
            localStorage.removeItem("optionBanner");
        } catch (error) {
            setUser(null);
            console.error('Error logging out:', error);
        } finally {
            navigate("/auth");
        }
    }

    const register = async (username, email, password, passwordConfirm) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.post("/auth/register",
                { username, email, password, passwordConfirm }
            )

            console.log("Registro exitoso: ", res);

            localStorage.setItem("pendingEmail", email);
            localStorage.setItem("fromRegister", "true");

            navigate("/verify-email");
        } catch (err) {
            console.error("Error registrando usuario:", err);
            alert(err.response?.data?.message || "Error en el registro");
        } finally {
            setLoading(false);
        }
    }

    const verifyEmail = async (email, code, fromRegister = false) => {
        try {
            setLoading(true);
            setError(null);
            const intCode = parseInt(code, 10);

            // Verificar el email
            const verifyRes = await api.post("/auth/verify-email", { email, code: intCode });
            console.log("Verificación de email exitosa: ", verifyRes.data);

            // Limpiar datos pendientes
            localStorage.removeItem("pendingEmail");
            
            if (fromRegister) {
                // Usuario recién registrado: ir a login
                localStorage.removeItem("fromRegister");
                navigate("/auth");
            } else {
                // Usuario que inició sesión pero no estaba verificado
                localStorage.removeItem("fromLogin");
                
                try {
                    // Intentar obtener los datos del usuario actualizado
                    const userRes = await api.get("/auth/me", { withCredentials: true });
                    const userData = userRes.data.user;
                    
                    if (userData) {
                        setUser(userData);
                        localStorage.setItem("user", JSON.stringify(userData));
                        navigate("/home");
                    } else {
                        // Si no se puede obtener el usuario, redirigir a login
                        console.warn("No se pudieron obtener los datos del usuario después de verificar");
                        navigate("/auth");
                    }
                } catch (userError) {
                    console.error("Error obteniendo datos del usuario después de verificar:", userError);
                    // Si falla obtener el usuario, redirigir a login para que inicie sesión nuevamente
                    navigate("/auth");
                }
            }

        } catch (err) {
            console.error("Error verificando email:", err);
            setError(err.response?.data?.message || "Error en la verificación");
        } finally {
            setLoading(false);
        }
    };

    const resendCode = async (email) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.post("/auth/resend-code", { email });
            console.log(res.data.message);
        } catch (error) {
            console.error("Error resending code:", error.response?.data || error.message);
            throw error;
        }
    }

    const passwordRecovery = async (email) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.post("/auth/password-recovery", { email });
            return res.data.message;
        } catch (err) {
            setError(err.response?.data?.message || "Error al solicitar recuperación de contraseña");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (email, code, password, passwordConfirm) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.post("/auth/reset-password", {
            email,
            code,
            password,
            passwordConfirm,
            });
            localStorage.removeItem("recoveryEmail");
            navigate("/auth");
        } catch (err) {
            setError(err.response?.data?.message || "Error al restablecer contraseña");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateUsername = async (newUsername) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.patch("/auth/update-username", { username: newUsername }, { withCredentials: true });

            setUser({ ...user, username: newUsername });
            localStorage.setItem("user", JSON.stringify({ ...user, username: newUsername }));

            return res.data.message;
        } catch (err) {
            setError(err.response?.data?.message || "Error al actualizar nombre de usuario");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            loading, 
            error, 
            register, 
            verifyEmail, 
            resendCode,
            passwordRecovery,
            resetPassword,
            updateUsername
        }}>
            {children}
        </AuthContext.Provider>
    );
}