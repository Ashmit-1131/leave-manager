const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');

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

module.exports = { listEmployees, adjustBalance, listAllPending };
