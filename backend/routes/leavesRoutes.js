const express = require('express');
const { applyLeave, getOwnLeaves, getPendingForAssigned, decideLeave } = require('../controllers/leaveController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const router = express.Router();

router.post('/', auth, applyLeave);
router.get('/me', auth, getOwnLeaves);
router.get('/pending', auth, getPendingForAssigned);
router.put('/:id/decide', auth, decideLeave); 
module.exports = router;
