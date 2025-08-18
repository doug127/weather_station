import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is required.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid access token.' });
        }
        req.user = user;
        next();
    });
}

export const authorizeRoles = (roles) => {
    return (req, res, next) => {
        console.log('User roles:', req.user.role_id);
        if (!req.user || !roles.includes(req.user.role_id)) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        next();
    };
}