// const cron = require('node-cron');
// const LeaveRequest = require('../models/LeaveRequest');
// const User = require('../models/User');
// const { sendLeaveActionEmail } = require('./mailer');

// function startScheduler() {
//   // runs every hour
//   cron.schedule('0 * * * *', async () => {
//     console.log('Scheduler tick:', new Date());
//     try {
//       const cutoff = new Date(Date.now() - 24*60*60*1000);
//       const stale = await LeaveRequest.find({ status: 'Pending', appliedAt: { $lte: cutoff } });
//       for (const leave of stale) {
//         // escalate to admin (HR)
//         const admins = await User.find({ role: 'admin' });
//         if (admins.length === 0) continue;
//         leave.status = 'Escalated';
//         await leave.save();
//         for (const hr of admins) {
//           const approveLink = `${process.env.FRONTEND_URL}/action/leave/${leave._id}/approve`;
//           const rejectLink = `${process.env.FRONTEND_URL}/action/leave/${leave._id}/reject`;
//           const html = `<p>Leave request escalated (no action within 24h): from ${leave.employeeSnapshot?.name || 'unknown'}</p>
//             <p>Dates: ${leave.startDate.toDateString()} - ${leave.endDate.toDateString()}</p>
//             <p><a href="${approveLink}">Approve</a> | <a href="${rejectLink}">Reject</a></p>`;
//           if (hr.email) await sendLeaveActionEmail({ to: hr.email, subject: 'Escalated Leave request', html });
//         }
//       }
//     } catch (err) {
//       console.error('Scheduler error', err);
//     }
//   });
// }

// module.exports = { startScheduler };


// utils/scheduler.js
const cron = require('node-cron');
const jwt = require('jsonwebtoken');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { sendLeaveActionEmail } = require('./mailer');

const ACTION_SECRET = process.env.ACTION_JWT_SECRET || process.env.JWT_SECRET;
const ACTION_EXPIRES = process.env.ACTION_JWT_EXPIRES || '24h';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 8082}`;

function startScheduler() {
  // runs every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('Scheduler tick:', new Date());
    try {
      const cutoff = new Date(Date.now() - 24*60*60*1000);
      const stale = await LeaveRequest.find({ status: 'Pending', appliedAt: { $lte: cutoff } });
      for (const leave of stale) {
        // escalate to admin (HR)
        const admins = await User.find({ role: 'admin' });
        if (admins.length === 0) continue;
        leave.status = 'Escalated';
        await leave.save();

        for (const hr of admins) {
          // create approve/reject token for each HR
          const approveToken = jwt.sign({ leaveId: String(leave._id), assignedTo: String(hr._id), action: 'approve' }, ACTION_SECRET, { expiresIn: ACTION_EXPIRES });
          const rejectToken  = jwt.sign({ leaveId: String(leave._id), assignedTo: String(hr._id), action: 'reject' }, ACTION_SECRET, { expiresIn: ACTION_EXPIRES });

          const approveLink = `${BACKEND_URL}/api/leaves/email-action?token=${approveToken}`;
          const rejectLink  = `${BACKEND_URL}/api/leaves/email-action?token=${rejectToken}`;

          const html = `<p>Leave request escalated (no action within 24h): from ${leave.employeeSnapshot?.name || 'unknown'}</p>
            <p>Dates: ${leave.startDate.toDateString()} - ${leave.endDate.toDateString()}</p>
            <p><a href="${approveLink}">Approve</a> | <a href="${rejectLink}">Reject</a></p>
            <p><small>Links expire in ${ACTION_EXPIRES}.</small></p>`;
          if (hr.email) await sendLeaveActionEmail({ to: hr.email, subject: 'Escalated Leave request', html });
        }
      }
    } catch (err) {
      console.error('Scheduler error', err);
    }
  });
}

module.exports = { startScheduler };

