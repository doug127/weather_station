export const RequireRole = ({ roles, user, children }) => {
    if(!user) return null;
    
    const roleId = Number(user.role_id); // 👈 forzamos a number
    if (!roles.includes(roleId)) return null;
    
    return children;
}