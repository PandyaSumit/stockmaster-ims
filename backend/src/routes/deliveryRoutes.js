const express = require('express');
const router = express.Router();
const {
  getDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  validateDelivery,
  deleteDelivery,
} = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getDeliveries)
  .post(createDelivery);

router.route('/:id')
  .get(getDelivery)
  .put(updateDelivery)
  .delete(authorize('Admin', 'Inventory Manager'), deleteDelivery);

router.put('/:id/validate', authorize('Admin', 'Inventory Manager'), validateDelivery);

module.exports = router;
