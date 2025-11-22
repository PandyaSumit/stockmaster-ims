const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getCategories)
  .post(authorize('Admin', 'Inventory Manager'), createCategory);

router.route('/:id')
  .get(getCategory)
  .put(authorize('Admin', 'Inventory Manager'), updateCategory)
  .delete(authorize('Admin', 'Inventory Manager'), deleteCategory);

module.exports = router;
