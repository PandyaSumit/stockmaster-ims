const express = require('express');
const router = express.Router();
const {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} = require('../controllers/warehouseController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// CRUD routes
router.route('/')
  .get(getWarehouses)
  .post(authorize('Admin'), createWarehouse);

router.route('/:id')
  .get(getWarehouse)
  .put(authorize('Admin'), updateWarehouse)
  .delete(authorize('Admin'), deleteWarehouse);

module.exports = router;
