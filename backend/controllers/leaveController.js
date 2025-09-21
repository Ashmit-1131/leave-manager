const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { sendLeaveActionEmail } = require('../utils/mailer');

const applyLeave = async (req, res) => {
  try {
    const { type, category, startDate, endDate, reason } = req.body;
    const employee = req.user;

    const s = new Date(startDate);
    const e = new Date(endDate);
    const msPerDay = 24*60*60*1000;
    const days = Math.round((e - s) / msPerDay) + 1;
    if (days <= 0) return res.status(400).json({ message: 'Invalid date range' });

    // basic balance check (you can extend)
    const balanceKey = type === 'Casual' ? 'casual' : 'privilege';
    if ((employee.leaveBalance[balanceKey] || 0) < days) {
      return res.status(400).json({ message: 'Not enough leave balance' });
    }

    // determine manager / assignedTo
    let assignedTo = employee.manager;
    // fallback: if no manager, assign to first admin (HR)
    if (!assignedTo) {
      const hr = await User.findOne({ role: 'admin' });
      if (hr) assignedTo = hr._id;
    }

    const leave = new LeaveRequest({
      employee: employee._id,
      employeeSnapshot: { name: employee.name, employeeId: employee.employeeId, email: employee.email, department: employee.department },
      type, category, startDate: s, endDate: e, days, reason, assignedTo
    });
    await leave.save();

    // send email to assignedTo (manager or HR) with Approve / Reject links
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      const approveLink = `${process.env.FRONTEND_URL}/action/leave/${leave._id}/approve`;
      const rejectLink = `${process.env.FRONTEND_URL}/action/leave/${leave._id}/reject`;
      const html = `
        <p>New leave request from ${employee.name} (${employee.employeeId})</p>
        <p>Type: ${type} - ${category}</p>
        <p>From: ${startDate} To: ${endDate} (${days} day(s))</p>
        <p>Reason: ${reason || 'N/A'}</p>
        <p>
          <a href="${approveLink}">Approve</a> |
          <a href="${rejectLink}">Reject</a>
        </p>
      `;
      if (assignedUser && assignedUser.email) {
        await sendLeaveActionEmail({ to: assignedUser.email, subject: 'Leave request pending your action', html });
      }
    }

    return res.status(201).json({ message: 'Leave applied', leave });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getOwnLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employee: req.user._id }).sort({ appliedAt: -1 });
    return res.json({ leaves });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getPendingForAssigned = async (req, res) => {
  try {
    // For admin / manager to see pending assigned to them
    const user = req.user;
    let query = { status: 'Pending' };
    if (user.role === 'employee') {
      query.employee = user._id;
    } else {
      query.assignedTo = user._id;
    }
    const leaves = await LeaveRequest.find(query).populate('employee', 'name employeeId email');
    return res.json({ leaves });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const decideLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comments } = req.body; // action: 'approve'|'reject'
    const user = req.user;
    const leave = await LeaveRequest.findById(id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });
    if (String(leave.assignedTo) !== String(user._id) && user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed to decide this leave' });
    }
    if (leave.status !== 'Pending') return res.status(400).json({ message: 'Leave already decided' });

    if (action === 'approve') {
      leave.status = 'Approved';
      // deduct balance
      const employee = await User.findById(leave.employee);
      const key = leave.type === 'Casual' ? 'casual' : 'privilege';
      employee.leaveBalance[key] = Math.max(0, (employee.leaveBalance[key] || 0) - leave.days);
      await employee.save();
    } else {
      leave.status = 'Rejected';
    }
    leave.decisionComments = comments || '';
    leave.decidedAt = new Date();
    leave.decidedBy = user._id;
    await leave.save();

    // notify employee
    const employeeUser = await User.findById(leave.employee);
    const html = `<p>Your leave request (${leave.type} / ${leave.category} from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()}) was <strong>${leave.status}</strong>.</p><p>Comments: ${leave.decisionComments}</p>`;
    if (employeeUser && employeeUser.email) {
      await sendLeaveActionEmail({ to: employeeUser.email, subject: `Your leave was ${leave.status}`, html });
    }

    return res.json({ message: `Leave ${leave.status}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { applyLeave, getOwnLeaves, getPendingForAssigned, decideLeave };
