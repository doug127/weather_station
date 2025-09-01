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
                const res = await api.get('/auth/me', { withCredentials: true });
                setUser(res.data.user);
            } catch (error) {
                setUser(null);
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    const login = async (username, password) => {
        try {
            setLoading(true);
            setError(null);

            await api.post("/auth/login", { username, password }, { withCredentials: true });

            const res = await api.get("/auth/me", { withCredentials: true });
            setUser(res.data.user);
            navigate("/Home");            
        } catch (err) {
            setError(err.response?.data?.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {        
        try {
            await api.post("/auth/logout", {}, { withCredentials: true});
            setUser(null);
            setOptionBanner('Init');
            localStorage.clear();
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

            navigate("/verify-email");
        } catch (err) {
            console.error("Error registrando usuario:", err);
            alert(err.response?.data?.message || "Error en el registro");
        }
    }

    const verifyEmail = async (email, code) => {
        try {
            setLoading(true);
            setError(null);
            const intCode = parseInt(code, 10);

            const res = await api.post("/auth/verify-email", 
                { 
                    email, 
                    code: intCode }
            );
            console.log("Verificación de email exitosa: ", res.data);
            localStorage.removeItem("pendingEmail");
            navigate("/auth");
        } catch (err) {
            console.error("Error verificando email:",   err);
            alert(err.response?.data?.message || "Error en la verificación");
        }
    }

    const resendCode = async (email) => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.post("auth/resend-code", { email });
            console.log(res.data.message);
        } catch (error) {
            console.error("Error resending code:", error.response?.data || error.message);
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            loading, 
            error, 
            register, 
            verifyEmail, 
            resendCode
        }}>
            {children}
        </AuthContext.Provider>
    );
}