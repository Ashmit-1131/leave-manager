const express = require('express');
const { listEmployees, adjustBalance, listAllPending } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const router = express.Router();

router.get('/employees', auth, authorize('admin'), listEmployees);
router.patch('/employees/:id/balance', auth, authorize('admin'), adjustBalance);
router.get('/leaves/pending', auth, authorize('admin'), listAllPending);

module.exports = router;
