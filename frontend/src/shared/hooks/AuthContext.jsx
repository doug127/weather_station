import { createContext, useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2';
import { api } from '../api/apiRoutes';
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [skipSessionCheck, setSkipSessionCheck] = useState(false);
    const hasCheckedSession = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (hasCheckedSession.current) {
            return;
        }

        const skipCheck = sessionStorage.getItem("skipSessionCheck");
        if (skipCheck === "true") {
            setLoading(false);
            hasCheckedSession.current = true;
            return;
        }
        
        const fetchUser = async () => {
            try {
                const publicRoutes = ['/auth', '/verify-email', '/reset-password', '/forgot-password', '/reset-code'];
                const currentPath = window.location.pathname;
                
                if (publicRoutes.includes(currentPath)) {
                    setLoading(false);
                    hasCheckedSession.current = true; 
                    return;
                }

                const storedUser = sessionStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    const res = await api.get("/auth/me", { withCredentials: true });
                    setUser(res.data.user);
                    sessionStorage.setItem("user", JSON.stringify(res.data.user));
                }
            } catch (error) {
                setUser(null);
                sessionStorage.removeItem("user");
                console.error("❌ Error en fetchUser:", error);

                const publicRoutes = ['/auth', '/verify-email', '/reset-password', '/forgot-password', '/reset-code'];
                const currentPath = window.location.pathname;
                
                if (!publicRoutes.includes(currentPath)) {
                    navigate("/auth");
                }
            } finally {
                setLoading(false);
                hasCheckedSession.current = true; 
            }
        }
        fetchUser();
    }, []);

    const login = async (identifier, password) => {
        try {
            setLoading(true);
            setError(null);

            await api.post("/auth/login", { identifier, password }, { withCredentials: true });
            
            const res = await api.get("/auth/me", { withCredentials: true });
            const userData = res.data.user;
            if (!userData) throw new Error("No se pudo obtener la información del usuario");

            if (!userData.isVerified) {
                sessionStorage.setItem("pendingEmail", userData.email);
                sessionStorage.setItem("fromLogin", "true");
                sessionStorage.setItem("fromRegister", "false");
                sessionStorage.setItem("skipSessionCheck", "true");

                try {
                    await api.post("/auth/resend-code", { email: userData.email });
                } catch (err) {
                    console.error("Error enviando el código automáticamente:", err);
                }

                setSkipSessionCheck(true);
                navigate("/verify-email");
                return;
            }

            // Usuario verificado: setear sesión
            setUser(userData);
            sessionStorage.setItem("user", JSON.stringify(userData));
            navigate("/home");
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Error al iniciar sesión";
            
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: message,
                confirmButtonColor: '#2563eb',
            })
            console.error("Error del login: ", message);
            setError(message);

        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {        
        try {
            await api.post("/auth/logout", {}, { withCredentials: true});
            setUser(null);
            sessionStorage.clear();
        } catch (error) {
            setUser(null);
            console.error('Error logging out:', error);
        } finally {
            navigate("/auth");
        }
    }

    const register = async (username, email, passwordReg, passwordConfirm, role) => {
        try {
            setError(null);

            const res = await api.post("/auth/register",
                { username, email, password: passwordReg, passwordConfirm, role }
            )

            sessionStorage.setItem("pendingEmail", email);
            sessionStorage.setItem("fromRegister", "true");
            sessionStorage.setItem("skipSessionCheck", "true");

            
            navigate("/verify-email");
            
        } catch (err) {
            const message = err.response?.data?.message || "Error en el registro";
            console.error("❌ Error en register:", message);

            Swal.fire({
                icon: "error",
                title: "Error en el proceso de registro",
                text: message,
                confirmButtonColor: '#2563eb'
            })

            setError(message);
        }
    }

    const verifyEmail = async (email, code, fromRegister = false) => {
        try {
            setLoading(true);
            setError(null);
            const intCode = parseInt(code, 10);

            // Verificar el email
            const verifyRes = await api.post("/auth/verify-email", { email, code: intCode });
            
            // Limpiar datos pendientes
            sessionStorage.removeItem("pendingEmail");
            
            if (fromRegister) {
                // Usuario recién registrado: ir a login
                sessionStorage.removeItem("fromRegister");
                sessionStorage.setItem("showSuccessAlert", "true");
                navigate("/auth");
            } else {
                // Usuario que inició sesión pero no estaba verificado
                sessionStorage.removeItem("fromLogin");
                
                try {
                    // Intentar obtener los datos del usuario actualizado
                    const userRes = await api.get("/auth/me", { withCredentials: true });
                    const userData = userRes.data.user;
                    
                    if (userData) {
                        setUser(userData);
                        sessionStorage.setItem("user", JSON.stringify(userData));
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
            const message = err.response?.data?.message || "Error en la verificación";
            console.error("Error verificando email:", err);

            Swal.fire({
                icon: "error",
                title: "Error en el proceso de registro",
                text: message,
                confirmButtonColor: '#2563eb'
            })

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const resendCode = async (email) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.post("/auth/resend-code", { email });
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
            sessionStorage.removeItem("recoveryEmail");
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
            sessionStorage.setItem("user", JSON.stringify({ ...user, username: newUsername }));

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