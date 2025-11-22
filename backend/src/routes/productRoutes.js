const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getStockAvailability,
  getReorderRules,
  updateReorderRule,
  getPurchaseSuggestions,
  generateSKU,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Generate SKU (before other routes to avoid conflict with :id)
router.get('/generate-sku', authorize('Admin', 'Inventory Manager'), generateSKU);

// Stock availability
router.get('/stock', getStockAvailability);

// Reorder rules
router.get('/reorder-rules', authorize('Admin', 'Inventory Manager'), getReorderRules);
router.put('/:id/reorder-rule', authorize('Admin', 'Inventory Manager'), updateReorderRule);

// Purchase suggestions
router.get('/purchase-suggestions', authorize('Admin', 'Inventory Manager'), getPurchaseSuggestions);

// CRUD routes
router.route('/')
  .get(getProducts)
  .post(authorize('Admin', 'Inventory Manager'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(authorize('Admin', 'Inventory Manager'), updateProduct)
  .delete(authorize('Admin', 'Inventory Manager'), deleteProduct);

module.exports = router;
