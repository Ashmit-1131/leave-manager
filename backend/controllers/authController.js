// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const register = async (req, res) => {
  try {
    const { email, employeeId, name, department, password, managerId } = req.body || {};

    // Basic validation
    if (!email || !employeeId || !name || !department || !password) {
      return res.status(400).json({ message: 'Please provide name, email, employeeId, department and password.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (typeof password !== 'string' || password.length < 5) {
      return res.status(400).json({ message: 'Password must be at least 5 characters long.' });
    }

    // Check existing user by email or employeeId
    const existing = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (existing) {
      if (existing.email === email && existing.employeeId === employeeId) {
        return res.status(409).json({ message: 'A user with this email and employee ID already exists.' });
      }
      if (existing.email === email) {
        return res.status(409).json({ message: 'A user with this email already exists.' });
      }
      return res.status(409).json({ message: 'A user with this employee ID already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Important: Public registration always creates an employee.
    const user = new User({
      email,
      employeeId,
      name,
      department,
      password: hashed,
      role: 'employee', // enforce employee role for public register
      manager: managerId || null
    });
    await user.save();

    return res.status(201).json({
      message: 'User registered successfully. Please login to continue.',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error while registering user.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        leaveBalance: user.leaveBalance || { casual: 0, privilege: 0 }
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error while logging in.' });
  }
};

module.exports = { register, login };
