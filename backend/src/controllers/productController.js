const Product = require('../models/Product');
const Category = require('../models/Category');
const Warehouse = require('../models/Warehouse');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
exports.getProducts = async (req, res) => {
  try {
    const { search, category, warehouse, status, page = 1, limit = 10 } = req.query;

    const query = {};

    // Search by name or SKU
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by warehouse
    if (warehouse) {
      query.warehouse = warehouse;
    }

    // Get all products first to calculate status
    let products = await Product.find(query)
      .populate('category', 'name')
      .populate('warehouse', 'name code')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Filter by stock status if provided
    if (status) {
      products = products.filter((product) => product.stockStatus === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = products.length;
    const paginatedProducts = products.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      count: paginatedProducts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: paginatedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name parentCategory')
      .populate('warehouse', 'name code location')
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Admin, Inventory Manager)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      category,
      unitOfMeasure,
      currentStock,
      reorderLevel,
      maxStockLevel,
      autoReorderEnabled,
      imageUrl,
      description,
      warehouse,
    } = req.body;

    // Validate required fields
    if (!name || !sku || !category || !unitOfMeasure || reorderLevel === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists',
      });
    }

    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category',
      });
    }

    // Validate warehouse if provided
    if (warehouse) {
      const warehouseExists = await Warehouse.findById(warehouse);
      if (!warehouseExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid warehouse',
        });
      }
    }

    // Create product
    const product = await Product.create({
      name,
      sku: sku.toUpperCase(),
      category,
      unitOfMeasure,
      currentStock: currentStock || 0,
      reorderLevel,
      maxStockLevel: maxStockLevel || null,
      autoReorderEnabled: autoReorderEnabled || false,
      imageUrl: imageUrl || null,
      description: description || '',
      warehouse: warehouse || null,
      createdBy: req.user._id,
      lastUpdatedBy: req.user._id,
    });

    // Populate references before sending response
    await product.populate('category', 'name');
    await product.populate('warehouse', 'name code');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin, Inventory Manager)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const {
      name,
      sku,
      category,
      unitOfMeasure,
      currentStock,
      reorderLevel,
      maxStockLevel,
      autoReorderEnabled,
      imageUrl,
      description,
      warehouse,
    } = req.body;

    // Check if new SKU conflicts with existing product
    if (sku && sku.toUpperCase() !== product.sku) {
      const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Product with this SKU already exists',
        });
      }
    }

    // Validate category if being updated
    if (category && category !== product.category.toString()) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category',
        });
      }
    }

    // Validate warehouse if being updated
    if (warehouse && warehouse !== product.warehouse?.toString()) {
      const warehouseExists = await Warehouse.findById(warehouse);
      if (!warehouseExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid warehouse',
        });
      }
    }

    // Update fields
    product.name = name || product.name;
    product.sku = sku ? sku.toUpperCase() : product.sku;
    product.category = category || product.category;
    product.unitOfMeasure = unitOfMeasure || product.unitOfMeasure;
    product.currentStock = currentStock !== undefined ? currentStock : product.currentStock;
    product.reorderLevel = reorderLevel !== undefined ? reorderLevel : product.reorderLevel;
    product.maxStockLevel = maxStockLevel !== undefined ? maxStockLevel : product.maxStockLevel;
    product.autoReorderEnabled = autoReorderEnabled !== undefined ? autoReorderEnabled : product.autoReorderEnabled;
    product.imageUrl = imageUrl !== undefined ? imageUrl : product.imageUrl;
    product.description = description !== undefined ? description : product.description;
    product.warehouse = warehouse !== undefined ? warehouse : product.warehouse;
    product.lastUpdatedBy = req.user._id;

    await product.save();

    // Populate references
    await product.populate('category', 'name');
    await product.populate('warehouse', 'name code');
    await product.populate('lastUpdatedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin, Inventory Manager)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
};

// @desc    Get stock availability (with filters)
// @route   GET /api/products/stock
// @access  Private
exports.getStockAvailability = async (req, res) => {
  try {
    const { category, warehouse, status, search } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (warehouse) {
      query.warehouse = warehouse;
    }

    let products = await Product.find(query)
      .populate('category', 'name')
      .populate('warehouse', 'name code')
      .sort({ currentStock: 1 });

    // Filter by stock status
    if (status) {
      products = products.filter((product) => product.stockStatus === status);
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stock availability',
      error: error.message,
    });
  }
};

// @desc    Get reorder rules
// @route   GET /api/products/reorder-rules
// @access  Private (Admin, Inventory Manager)
exports.getReorderRules = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('warehouse', 'name code')
      .select('name sku category warehouse currentStock reorderLevel maxStockLevel autoReorderEnabled')
      .sort({ name: 1 });

    const reorderRules = products.map((product) => ({
      _id: product._id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      warehouse: product.warehouse,
      currentStock: product.currentStock,
      reorderLevel: product.reorderLevel,
      maxStockLevel: product.maxStockLevel,
      autoReorderEnabled: product.autoReorderEnabled,
      stockStatus: product.stockStatus,
      suggestedOrderQty: product.suggestedOrderQty,
    }));

    res.status(200).json({
      success: true,
      count: reorderRules.length,
      data: reorderRules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reorder rules',
      error: error.message,
    });
  }
};

// @desc    Update reorder rule for a product
// @route   PUT /api/products/:id/reorder-rule
// @access  Private (Admin, Inventory Manager)
exports.updateReorderRule = async (req, res) => {
  try {
    const { reorderLevel, maxStockLevel, autoReorderEnabled } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (reorderLevel !== undefined) {
      product.reorderLevel = reorderLevel;
    }

    if (maxStockLevel !== undefined) {
      product.maxStockLevel = maxStockLevel;
    }

    if (autoReorderEnabled !== undefined) {
      product.autoReorderEnabled = autoReorderEnabled;
    }

    product.lastUpdatedBy = req.user._id;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Reorder rule updated successfully',
      data: {
        _id: product._id,
        name: product.name,
        sku: product.sku,
        reorderLevel: product.reorderLevel,
        maxStockLevel: product.maxStockLevel,
        autoReorderEnabled: product.autoReorderEnabled,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating reorder rule',
      error: error.message,
    });
  }
};

// @desc    Get purchase suggestions (low stock products)
// @route   GET /api/products/purchase-suggestions
// @access  Private (Admin, Inventory Manager)
exports.getPurchaseSuggestions = async (req, res) => {
  try {
    let products = await Product.find()
      .populate('category', 'name')
      .populate('warehouse', 'name code')
      .sort({ currentStock: 1 });

    // Filter products that need reordering
    const suggestions = products
      .filter((product) => product.stockStatus === 'low_stock' || product.stockStatus === 'out_of_stock')
      .map((product) => ({
        _id: product._id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        warehouse: product.warehouse,
        currentStock: product.currentStock,
        reorderLevel: product.reorderLevel,
        maxStockLevel: product.maxStockLevel,
        stockStatus: product.stockStatus,
        suggestedOrderQty: product.suggestedOrderQty,
        autoReorderEnabled: product.autoReorderEnabled,
      }));

    res.status(200).json({
      success: true,
      count: suggestions.length,
      data: suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching purchase suggestions',
      error: error.message,
    });
  }
};

// @desc    Generate unique SKU
// @route   GET /api/products/generate-sku
// @access  Private (Admin, Inventory Manager)
exports.generateSKU = async (req, res) => {
  try {
    const { categoryId } = req.query;

    let prefix = 'PRD';

    // If category provided, use first 3 letters of category name
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (category) {
        prefix = category.name.substring(0, 3).toUpperCase();
      }
    }

    // Find the last product with this prefix
    const lastProduct = await Product.findOne({ sku: new RegExp(`^${prefix}`) })
      .sort({ sku: -1 })
      .limit(1);

    let sequence = 1;

    if (lastProduct) {
      // Extract number from last SKU
      const lastSequence = parseInt(lastProduct.sku.replace(prefix, ''));
      if (!isNaN(lastSequence)) {
        sequence = lastSequence + 1;
      }
    }

    // Generate SKU with 5-digit padding
    const sku = `${prefix}${sequence.toString().padStart(5, '0')}`;

    res.status(200).json({
      success: true,
      data: { sku },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating SKU',
      error: error.message,
    });
  }
};
