const express = require('express');
const router = express.Router();
const {
  getAdjustments,
  getAdjustment,
  createAdjustment,
} = require('../controllers/adjustmentController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getAdjustments)
  .post(authorize('Admin', 'Inventory Manager'), createAdjustment);

router.route('/:id')
  .get(getAdjustment);

module.exports = router;
