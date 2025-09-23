// src/routes/leavesRoutes.js
const express = require('express');
const {
  applyLeave,
  getOwnLeaves,
  getPendingForAssigned,
  decideLeave,
  handleEmailAction,
  getLeaveById
} = require('../controllers/leaveController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

const router = express.Router();

// Protected routes
router.post('/', auth, applyLeave);
router.get('/me', auth, getOwnLeaves);
router.get('/pending', auth, getPendingForAssigned);

// ✅ Public endpoint for email token actions (must come BEFORE /:id)
router.get('/email-action', handleEmailAction);

// Protected routes with dynamic params
router.get('/:id', auth, getLeaveById);
router.put('/:id/decide', auth, decideLeave);

module.exports = router;
