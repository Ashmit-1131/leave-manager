const jwt = require('jsonwebtoken');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { sendLeaveActionEmail } = require('../utils/mailer');

const ACTION_SECRET = process.env.ACTION_JWT_SECRET || process.env.JWT_SECRET;
const ACTION_EXPIRES = process.env.ACTION_JWT_EXPIRES || '24h';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 8082}`;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Helper: create JWT token for approve/reject action
function createActionToken({ leaveId, assignedTo, action }) {
  const payload = { leaveId: String(leaveId), assignedTo: String(assignedTo), action };
  return jwt.sign(payload, ACTION_SECRET, { expiresIn: ACTION_EXPIRES });
}

// Apply leave
const applyLeave = async (req, res) => {
  try {
    const { type, category, startDate, endDate, reason } = req.body || {};
    const employee = req.user;

    if (!type || !['Casual', 'Privilege'].includes(type)) {
      return res.status(400).json({ message: 'Invalid or missing type (Casual|Privilege).' });
    }
    if (!category || !['Sick', 'Vacation'].includes(category)) {
      return res.status(400).json({ message: 'Invalid or missing category (Sick|Vacation).' });
    }
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required.' });
    }

    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s) || isNaN(e)) return res.status(400).json({ message: 'Invalid date format.' });
    const msPerDay = 24 * 60 * 60 * 1000;
    const days = Math.round((e - s) / msPerDay) + 1;
    if (days <= 0) return res.status(400).json({ message: 'Invalid date range' });

    // basic balance check
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

    // send email to assignedTo (manager or HR) with Approve / Reject tokenized links
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      if (assignedUser && assignedUser.email) {
        // create signed tokens
        const approveToken = createActionToken({ leaveId: leave._id, assignedTo: assignedUser._id, action: 'approve' });
        const rejectToken = createActionToken({ leaveId: leave._id, assignedTo: assignedUser._id, action: 'reject' });

        // links point to backend email-action endpoint so clicking acts immediately
        const approveLink = `${BACKEND_URL}/api/leaves/email-action?token=${approveToken}`;
        const rejectLink = `${BACKEND_URL}/api/leaves/email-action?token=${rejectToken}`;

        const html = `
          <p>New leave request from <strong>${employee.name}</strong> (${employee.employeeId})</p>
          <p>Type: ${type} - ${category}</p>
          <p>From: ${s.toDateString()} To: ${e.toDateString()} (${days} day(s))</p>
          <p>Reason: ${reason || 'N/A'}</p>
          <p>
            <a href="${approveLink}">Approve</a> | <a href="${rejectLink}">Reject</a>
          </p>
          <p><small>Links expire in ${ACTION_EXPIRES}. You can also open this request in the application: <a href="${FRONTEND_URL}/action/leave/${leave._id}">Open in app</a>.</small></p>
        `;
        await sendLeaveActionEmail({ to: assignedUser.email, subject: 'Leave request pending your action', html });
      }
    }

    return res.status(201).json({ message: 'Leave applied', leave });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user; // auth middleware must set req.user
    const leave = await LeaveRequest.findById(id).populate('employee', 'name employeeId email leaveBalance');
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    // Authorization rules:
    // - employee can view their own leave
    // - assigned manager or admin can view
    const isOwner = String(leave.employee._id) === String(user._id);
    const isAssigned = String(leave.assignedTo) === String(user._id);
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAssigned && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this leave' });
    }

    return res.json({ leave });
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
    const { action, comments } = req.body; 
    const user = req.user;
    const leave = await LeaveRequest.findById(id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });
    if (String(leave.assignedTo) !== String(user._id) && user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed to decide this leave' });
    }
    if (leave.status !== 'Pending' && leave.status !== 'Escalated') {
      return res.status(400).json({ message: 'Leave already decided' });
    }

    let updatedEmployee;
    if (action === 'approve') {
      leave.status = 'Approved';
      // deduct balance
      const employee = await User.findById(leave.employee);
      const key = leave.type === 'Casual' ? 'casual' : 'privilege';
      employee.leaveBalance[key] = Math.max(0, (employee.leaveBalance[key] || 0) - leave.days);
      updatedEmployee = await employee.save();
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

    return res.json({
      message: `Leave ${leave.status}`,
      leave,
      updatedBalance: updatedEmployee ? updatedEmployee.leaveBalance : undefined
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


// NEW: handle email action via token
const handleEmailAction = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send('Missing token');

    let payload;
    try {
      payload = jwt.verify(token, ACTION_SECRET);
    } catch (err) {
      return res.status(400).send('Invalid or expired token');
    }

    const { leaveId, assignedTo, action } = payload;
    const leave = await LeaveRequest.findById(leaveId);
    if (!leave) return res.status(404).send('Leave request not found');

    // allow admin HR tokens to act on escalated leaves even if assignedTo differs:
    const assignedUserObj = await User.findById(assignedTo);
    if (!assignedUserObj) return res.status(403).send('Token user not found');

    const isEscalatedAdminAction =
      leave.status === 'Escalated' && assignedUserObj.role === 'admin';

    // ensure token was issued for this assignedTo unless it's a valid HR escalated action
    if (!isEscalatedAdminAction) {
      if (String(leave.assignedTo) !== String(assignedTo)) {
        return res.status(403).send('Token not valid for this leave');
      }
    }

    // allow action only when Pending or Escalated
    if (!['Pending', 'Escalated'].includes(leave.status)) {
      return res.status(400).send('Leave already decided');
    }

    let updatedEmployee;
    if (action === 'approve') {
      leave.status = 'Approved';
      // deduct balance
      const employee = await User.findById(leave.employee);
      const key = leave.type === 'Casual' ? 'casual' : 'privilege';
      employee.leaveBalance[key] = Math.max(
        0,
        (employee.leaveBalance[key] || 0) - leave.days
      );
      updatedEmployee = await employee.save();
    } else if (action === 'reject') {
      leave.status = 'Rejected';
    } else {
      return res.status(400).send('Invalid action');
    }

    leave.decisionComments = `Actioned via email (${action})`;
    leave.decidedAt = new Date();
    leave.decidedBy = assignedTo;
    await leave.save();

    // notify employee
    const employeeUser = await User.findById(leave.employee);
    const notifyHtml = `<p>Your leave request (${leave.type} / ${leave.category} from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()}) was <strong>${leave.status}</strong>.</p><p>Comments: ${leave.decisionComments}</p>`;
    if (employeeUser && employeeUser.email) {
      await sendLeaveActionEmail({
        to: employeeUser.email,
        subject: `Your leave was ${leave.status}`,
        html: notifyHtml,
      });
    }

    // if coming from email, redirect to frontend success page
    if (FRONTEND_URL && !req.headers.accept?.includes('application/json')) {
      const successPath =
        action === 'approve'
          ? '/action-success?status=approved'
          : '/action-success?status=rejected';
      return res.redirect(`${FRONTEND_URL}${successPath}`);
    }

    // if API client (expects JSON), return data with updated balance
    return res.json({
      message: `Leave ${leave.status}`,
      leave,
      updatedBalance: updatedEmployee ? updatedEmployee.leaveBalance : undefined,
    });
  } catch (err) {
    console.error('Email action error', err);
    return res.status(500).send('Server error');
  }
};


module.exports = { applyLeave, getOwnLeaves, getPendingForAssigned, decideLeave, handleEmailAction, getLeaveById };
