const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, default: '' },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'admin'], default: 'employee' },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  leaveBalance: {
    casual: { type: Number, default: 8 },
    privilege: { type: Number, default: 12 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
