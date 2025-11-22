const Adjustment = require('../models/Adjustment');
const Product = require('../models/Product');

// Generate unique adjustment number
const generateAdjustmentNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `ADJ-${year}-`;

  const lastAdjustment = await Adjustment.findOne({ adjustmentNumber: new RegExp(`^${prefix}`) })
    .sort({ adjustmentNumber: -1 })
    .limit(1);

  let sequence = 1;
  if (lastAdjustment) {
    const lastSequence = parseInt(lastAdjustment.adjustmentNumber.replace(prefix, ''));
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  return `${prefix}${sequence.toString().padStart(3, '0')}`;
};

// @desc    Get all adjustments
// @route   GET /api/adjustments
// @access  Private
exports.getAdjustments = async (req, res) => {
  try {
    const { reason, warehouse, startDate, endDate, search } = req.query;

    const query = {};

    if (reason) {
      query.reason = reason;
    }

    if (warehouse) {
      query.warehouse = warehouse;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      query.adjustmentNumber = { $regex: search, $options: 'i' };
    }

    const adjustments = await Adjustment.find(query)
      .populate('product', 'name sku')
      .populate('warehouse', 'name code')
      .populate('adjustedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: adjustments.length,
      data: adjustments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching adjustments',
      error: error.message,
    });
  }
};

// @desc    Get single adjustment
// @route   GET /api/adjustments/:id
// @access  Private
exports.getAdjustment = async (req, res) => {
  try {
    const adjustment = await Adjustment.findById(req.params.id)
      .populate('product', 'name sku unitOfMeasure')
      .populate('warehouse', 'name code location')
      .populate('adjustedBy', 'name email');

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: 'Adjustment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: adjustment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching adjustment',
      error: error.message,
    });
  }
};

// @desc    Create adjustment (and update stock)
// @route   POST /api/adjustments
// @access  Private (Admin, Inventory Manager)
exports.createAdjustment = async (req, res) => {
  try {
    const { product: productId, warehouse, physicalCount, reason, notes } = req.body;

    if (!productId || physicalCount === undefined || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (physicalCount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Physical count cannot be negative',
      });
    }

    // Get product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const systemStock = product.currentStock;
    const difference = physicalCount - systemStock;

    const adjustmentNumber = await generateAdjustmentNumber();

    // Create adjustment record
    const adjustment = await Adjustment.create({
      adjustmentNumber,
      product: productId,
      warehouse: warehouse || null,
      systemStock,
      physicalCount,
      difference,
      reason,
      notes: notes || '',
      adjustedBy: req.user._id,
    });

    // Update product stock
    product.currentStock = physicalCount;
    product.lastUpdatedBy = req.user._id;
    await product.save();

    await adjustment.populate('product', 'name sku');
    await adjustment.populate('warehouse', 'name code');

    res.status(201).json({
      success: true,
      message: 'Adjustment created and stock updated successfully',
      data: adjustment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating adjustment',
      error: error.message,
    });
  }
};
