import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'El token de acceso es requerido.' });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token de acceso inválido.' });
    }
}

export const authorizeRoles = (roles) => {
    return (req, res, next) => {
        console.log('User roles:', req.user.role_id);
        if (!req.user || !roles.includes(req.user.role_id)) {
            return res.status(403).json({ message: 'Access denegado.' });
        }
        next();
    };
}