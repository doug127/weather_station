import {User} from "../models/User.js";
import {Role} from "../models/Role.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, attributes: ["name"] }] // solo traemos el nombre del rol
    });

    const usersData = users.map(u => ({
      id: u.id,
      username: u.username,
      role_id: u.role_id,
      role: u.Role?.name || "N/A"
    }));

    res.json({
      message: 'Usuarios obtenidos correctamente',
      users: usersData
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserRoles = async (req, res) => {
  const { roles } = req.body; // { userId: roleId }

  try {
    const userIds = Object.keys(roles).map(id => Number(id)); // asegurar que sean números

    // Encontramos los usuarios que vamos a actualizar
    const users = await User.findAll({
      where: { id: userIds }
    });

    // Actualizamos cada usuario
    const updatePromises = users.map(user => {
      const newRoleId = Number(roles[user.id]); // aseguramos que sea número
      return user.update({ role_id: newRoleId });
    });

    await Promise.all(updatePromises);

    res.json({ message: "Roles updated successfully" });
  } catch (error) {
    console.error("Error updating user roles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
