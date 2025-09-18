import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

// const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { email, password, passwordConfirm, username } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'El correo electrónico es requerido' });
    }

    const hasEmail = /\S+@\S+\.\S+/;

    if (!hasEmail.test(email)) {
      return res.status(400).json({ message: 'El formato de correo electróico es incorrecto' });
    }

    const hasMayus = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasMayus || !hasSpecialChar || !hasNumber) {
      return res.status(400).json({ message: 'La contraseña debe contener al menos una letra mayúscula, un caractér especial y un número.' });
    }

    if (!passwordConfirm) {
      return res.status(400).json({ message: 'Confirmar contraseña es requerido.' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    } 

    if (!password) {
        return res.status(400).json({ message: 'La contraseña es requerida.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUsername = await User.findAll({ where: { username } });

    if (!username) {
        return res.status(400).json({ message: 'El nombre de usuario es requerido.' });
    }

    if (existingUsername.length > 0) {
        return res.status(400).json({ message: 'El nombre de usuario ya existe.' });
    }

    const role_user = 3;
    const role_id = role_user;

    const verificationCode = crypto.randomInt(100000, 999999);
    const minutes = 15  * 1000 * 60;
    const expirationTime = new Date(Date.now() + minutes);

    const user = await User.create({ 
      email, 
      password: hashedPassword, 
      username, 
      role_id,
      isVerified: false,
      code: verificationCode,
      codeExpiresAt: expirationTime
    });

    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'Usuario registrado correctamente.' });
  } catch (error) {
    console.error('Error registrando el usuario:', error);
    res.status(500).json({ message: 'Error registrando el usuario.', error: error.message });
  }
}

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El correo electrónico es requerido.' });
    }

    if (!code) {
      return res.status(400).json({ message: 'El código de verificación es requerido.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'El usuario no ha sido encontrado.' });
    }

    if (user.code !== code) {
      return res.status(400).json({ message: 'Código de verificación inválido.' });
    }

    if (user.codeExpiresAt < new Date()) {
      return res.status(400).json({ message: 'El código de verificación ha expirado, por favor vuelva a reenviar el código.' });
    }

    user.isVerified = true;
    user.code = null;
    user.codeExpiresAt = null;
    await user.save();

    res.status(200).json({ message: 'El correo electrónico ha sido registrado correctamente.' });
  } catch (error) {
    console.error('Error verificando el correo electrónico:', error);
    res.status(500).json({ message: 'Error verificando el correo electrónico', error: error.message });
  }
};

export const resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "El usuario no ha sido encontrado." });

    const verificationCode = crypto.randomInt(100000, 999999);
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000);

    user.code = verificationCode;
    user.codeExpiresAt = expirationTime;
    await user.save();

    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: "El código ha sido reenviado a su correo electrónico" });
  } catch (error) {
    res.status(500).json({ message: "Error al reenviar el código", error: error.message });
  }
}

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: 'El correo electrónico o el nombre de usuario es requerido.' });
    }

    const isEmail = /\S+@\S+\.\S+/.test(identifier);

    const user = await User.findOne({
      where: isEmail ? { email: identifier } : { username: identifier }
    });

    if (!user) {
      return res.status(404).json({ message: 'El usuario no ha sido encontrado.' });
    }

    if (!password) {
      return res.status(400).json({ message: 'La contraseña es requerida.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña inválida.' });
    }

    const token = jwt.sign({ 
      id: user.id,
      username: user.username,
      role_id: user.role_id
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // falso en desarrollo
      sameSite: 'lax', // permite enviar cookie cross-origin en desarrollo
      maxAge: 15 * 60 * 1000
    });

    res.status(200).json({ message: 'Sesión iniciada correctamente.' });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
}

export const logout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Sesión cerrada correctamente.' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ message: 'Error al cerrar sesión', error: error.message });
  }
}

export const passwordRecovery = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El correo electrónico es requerido.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'El usuario no ha sido encontrado.' });
    }

    const expirationTime = new Date(Date.now() + 15 * 60 * 1000); 

    const recoveryCode = crypto.randomInt(100000, 999999);
    user.code = recoveryCode;
    user.codeExpiresAt = expirationTime;
    await user.save();

    await sendVerificationEmail(email, recoveryCode);

    res.status(200).json({ message: 'El código de recuperación ha sido enviado a tu correo electrónico.' });
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error);
    res.status(500).json({ message: 'Error al enviar el correo de recuperación', error: error.message });
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, code, password, passwordConfirm } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El correo electrónico es requerido.' });
    }

    if (!code) {
      return res.status(400).json({ message: 'El código de recuperación es requerido.' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Nueva contraseña es requerida.' });
    }

    if (!passwordConfirm) {
      return res.status(400).json({ message: 'El campo confirmar contraseña es requerido.' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'El usuario no ha sido encontrado.' });
    }

    if (user.code !== code) {
      return res.status(400).json({ message: 'El código de recuperación es inválido.' });
    }

    if (user.codeExpiresAt < new Date()) {
      return res.status(400).json({ message: 'El código de recuperación ha sido enviado a tu correo electrónico.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.code = null; 
    user.codeExpiresAt = null;
    await user.save();

    res.status(200).json({ message: 'La contraseña ha sido actualizada con éxito.' });
  } catch (error) {
    console.error('Error al actualizar cotraseña:', error);
    res.status(500).json({ message: 'Error al actualizar cotraseña', error: error.message });
  }
}

export const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;

    if(!username) {
        return res.status(400).json({ message: 'El usuario es requerido.' });
    }

    const existingUser = await User.findOne({ where: { username } });
    
    if (existingUser) {
        return res.status(400).json({ message: 'El nombre de usuario ya existe.' });
    }

    const user = await User.findByPk(req.user.id);
    if(!user) {
        return res.status(404).json({ message: 'El usuario no ha sido encontrado.' });
    }

    user.username = username || user.username;
    await user.save();

    res.json({
        message: 'El nombre de usuario ha sido actualizado correctamente.',
        data: user.username
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const {username} = req.user;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'El usuario no ha sido encontrado.' });
    }

    const userData = {
      email: user.email,
      username: user.username,
      role_id: user.role_id,
      isVerified: user.isVerified
    }

    res.status(200).json({ user: userData });
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
    res.status(500).json({ message: 'Error al obtener el usuario actual', error: error.message });
  }
}