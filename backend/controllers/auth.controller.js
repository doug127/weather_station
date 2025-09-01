import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { email, password, passwordConfirm, username } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    const hasEmail = /\S+@\S+\.\S+/;

    if (!hasEmail.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    const hasMayus = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasMayus || !hasSpecialChar || !hasNumber) {
      return res.status(400).json({ message: 'Password must contain at least one uppercase letter, one special character, and one number.' });
    }

    if (!passwordConfirm) {
      return res.status(400).json({ message: 'Password confirmation is required.' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    } 

    if (!password) {
        return res.status(400).json({ message: 'Password is required.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUsername = await User.findAll({ where: { username } });

    if (!username) {
        return res.status(400).json({ message: 'Username is required.' });
    }

    if (existingUsername.length > 0) {
        return res.status(400).json({ message: 'Username already exists.' });
    }

    const role_id = 2;

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

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
}

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    console.log('Verifying email:', email, 'with code:', code);

    if (!email) {
      return res.status(400).json({ message: 'Email is are required.' });
    }

    if (!code) {
      return res.status(400).json({ message: 'Verification code is required.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.code !== code) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    if (user.codeExpiresAt < new Date()) {
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }

    user.isVerified = true;
    user.code = null;
    user.codeExpiresAt = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Error verifying email', error: error.message });
  }
};

export const resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const verificationCode = crypto.randomInt(100000, 999999);
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000);

    user.code = verificationCode;
    user.codeExpiresAt = expirationTime;
    await user.save();

    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: "New code sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error resending code", error: error.message });
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    const token = jwt.sign({ 
      id: user.id,
      username: user.username,
      role_id: user.role_id
    }, 
    JWT_SECRET, 
    { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
}

export const logout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: 'Error logging out', error: error.message });
  }
}

export const passwordRecovery = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const recoveryCode = crypto.randomInt(100000, 999999);
    user.code = recoveryCode;
    await user.save();

    await sendVerificationEmail(email, recoveryCode);

    res.status(200).json({ message: 'Recovery code sent to your email.' });
  } catch (error) {
    console.error('Error sending recovery code:', error);
    res.status(500).json({ message: 'Error sending recovery code', error: error.message });
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, code, password, passwordConfirm } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    if (!code) {
      return res.status(400).json({ message: 'Recovery code is required.' });
    }

    if (!password) {
      return res.status(400).json({ message: 'New password is required.' });
    }

    if (!passwordConfirm) {
      return res.status(400).json({ message: 'Password confirmation is required.' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.code !== code) {
      return res.status(400).json({ message: 'Invalid recovery code.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.code = null; 
    await user.save();

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
}

export const getCurrentUser = (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ message: 'Error getting current user', error: error.message });
  }
}