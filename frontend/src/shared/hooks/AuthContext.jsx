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

    // const register = async ( username, email, password, confirmPassword ) => {
    //     try {
    //         setLoading(true);
    //         setError(null);

    //         if (password !== confirmPassword) {
    //             setError("Las contraseñas no coinciden");
    //             return;
    //         }

    //         await api.post("/auth/register", { username, email, password }, { withCredentials: true });

    //         const res = await api.get("/auth/me", { withCredentials: true });
    //         setUser(res.data.user);
    //         navigate("/verify-password");
    //     } catch (err) {
    //         setError(err.response?.data?.message || "Error al registrar");
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
}