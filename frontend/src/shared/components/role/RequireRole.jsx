export const RequireRole = ({ minRole, user, children }) => {
    if(!user) return null;
    
    const userRole = Number(user.role_id);
    
    if (userRole > minRole) return null;
    
    return children;
}