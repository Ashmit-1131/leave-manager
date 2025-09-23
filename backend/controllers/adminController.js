const bcrypt = require('bcrypt');
const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');

// list all employees (no password)
const listEmployees = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ name: 1 });
    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const adjustBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { casual, privilege } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (typeof casual === 'number') user.leaveBalance.casual = casual;
    if (typeof privilege === 'number') user.leaveBalance.privilege = privilege;
    await user.save();
    return res.json({ message: 'Balance updated', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const listAllPending = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ status: 'Pending' }).populate('employee', 'name employeeId email');
    return res.json({ leaves });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// create admin (protected route) - existing admin can create another admin
const createAdmin = async (req, res) => {
  try {
    const { email, employeeId, name, department, password, managerId } = req.body || {};
    if (!email || !employeeId || !name || !department || !password) {
      return res.status(400).json({ message: 'Please provide name, email, employeeId, department and password.' });
    }

    const existing = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (existing) return res.status(409).json({ message: 'User with provided email or employeeId already exists.' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      employeeId,
      name,
      department,
      password: hashed,
      role: 'admin',
      manager: managerId || null
    });
    await user.save();

    return res.status(201).json({ message: 'Admin created', user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error('createAdmin error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listEmployees, adjustBalance, listAllPending, createAdmin };
