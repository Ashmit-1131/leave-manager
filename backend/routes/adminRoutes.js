const express = require('express');
const {
  listEmployees,
  adjustBalance,
  listAllPending,
  createAdmin
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const router = express.Router();

// admin-only endpoints
router.get('/employees', auth, authorize('admin'), listEmployees);
router.patch('/employees/:id/balance', auth, authorize('admin'), adjustBalance);
router.get('/leaves/pending', auth, authorize('admin'), listAllPending);

// create admin (protected) — allows an existing admin to create another admin
router.post('/create', auth, authorize('admin'), createAdmin);

module.exports = router;
