const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeSnapshot: { type: Object }, // snapshot of name/id/department at time of apply
  type: { type: String, enum: ['Casual', 'Privilege'], required: true },
  category: { type: String, enum: ['Sick', 'Vacation'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number, required: true },
  reason: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Escalated'], default: 'Pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // manager or HR
  appliedAt: { type: Date, default: Date.now },
  decidedAt: { type: Date, default: null },
  decidedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  decisionComments: { type: String, default: '' }
});

module.exports = mongoose.model('LeaveRequest', leaveSchema);
