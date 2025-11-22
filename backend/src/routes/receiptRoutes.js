const express = require('express');
const router = express.Router();
const {
  getReceipts,
  getReceipt,
  createReceipt,
  updateReceipt,
  validateReceipt,
  deleteReceipt,
} = require('../controllers/receiptController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getReceipts)
  .post(createReceipt);

router.route('/:id')
  .get(getReceipt)
  .put(updateReceipt)
  .delete(authorize('Admin', 'Inventory Manager'), deleteReceipt);

router.put('/:id/validate', authorize('Admin', 'Inventory Manager'), validateReceipt);

module.exports = router;
