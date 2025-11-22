const Receipt = require('../models/Receipt');
const Product = require('../models/Product');

// Generate unique receipt number
const generateReceiptNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `RCP-${year}-`;

  const lastReceipt = await Receipt.findOne({ receiptNumber: new RegExp(`^${prefix}`) })
    .sort({ receiptNumber: -1 })
    .limit(1);

  let sequence = 1;
  if (lastReceipt) {
    const lastSequence = parseInt(lastReceipt.receiptNumber.replace(prefix, ''));
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  return `${prefix}${sequence.toString().padStart(3, '0')}`;
};

// @desc    Get all receipts
// @route   GET /api/receipts
// @access  Private
exports.getReceipts = async (req, res) => {
  try {
    const { status, supplier, startDate, endDate, search } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (supplier) {
      query.supplier = { $regex: supplier, $options: 'i' };
    }

    if (startDate || endDate) {
      query.expectedDate = {};
      if (startDate) query.expectedDate.$gte = new Date(startDate);
      if (endDate) query.expectedDate.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { receiptNumber: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } },
      ];
    }

    const receipts = await Receipt.find(query)
      .populate('items.product', 'name sku')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: receipts.length,
      data: receipts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching receipts',
      error: error.message,
    });
  }
};

// @desc    Get single receipt
// @route   GET /api/receipts/:id
// @access  Private
exports.getReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('items.product', 'name sku unitOfMeasure')
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email');

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found',
      });
    }

    res.status(200).json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching receipt',
      error: error.message,
    });
  }
};

// @desc    Create receipt
// @route   POST /api/receipts
// @access  Private
exports.createReceipt = async (req, res) => {
  try {
    const { supplier, expectedDate, items, referenceNumber, notes } = req.body;

    if (!supplier || !expectedDate || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Validate all products exist
    const productIds = items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more products not found',
      });
    }

    const receiptNumber = await generateReceiptNumber();

    const receipt = await Receipt.create({
      receiptNumber,
      supplier,
      expectedDate,
      items,
      referenceNumber: referenceNumber || '',
      notes: notes || '',
      createdBy: req.user._id,
      lastUpdatedBy: req.user._id,
    });

    await receipt.populate('items.product', 'name sku');

    res.status(201).json({
      success: true,
      message: 'Receipt created successfully',
      data: receipt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating receipt',
      error: error.message,
    });
  }
};

// @desc    Update receipt
// @route   PUT /api/receipts/:id
// @access  Private
exports.updateReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found',
      });
    }

    if (receipt.status === 'Done') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a completed receipt',
      });
    }

    const { supplier, expectedDate, receivedDate, items, status, referenceNumber, notes } =
      req.body;

    if (supplier) receipt.supplier = supplier;
    if (expectedDate) receipt.expectedDate = expectedDate;
    if (receivedDate !== undefined) receipt.receivedDate = receivedDate;
    if (items) receipt.items = items;
    if (status) receipt.status = status;
    if (referenceNumber !== undefined) receipt.referenceNumber = referenceNumber;
    if (notes !== undefined) receipt.notes = notes;

    receipt.lastUpdatedBy = req.user._id;

    await receipt.save();
    await receipt.populate('items.product', 'name sku');

    res.status(200).json({
      success: true,
      message: 'Receipt updated successfully',
      data: receipt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating receipt',
      error: error.message,
    });
  }
};

// @desc    Validate receipt (update stock)
// @route   PUT /api/receipts/:id/validate
// @access  Private (Admin, Inventory Manager)
exports.validateReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id).populate('items.product');

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found',
      });
    }

    if (receipt.status === 'Done') {
      return res.status(400).json({
        success: false,
        message: 'Receipt already validated',
      });
    }

    // Update stock for each item
    for (const item of receipt.items) {
      const product = await Product.findById(item.product._id);
      if (product && item.qualityStatus === 'Pass') {
        product.currentStock += item.receivedQty;
        product.lastUpdatedBy = req.user._id;
        await product.save();
      }
    }

    // Update receipt status
    receipt.status = 'Done';
    receipt.receivedDate = new Date();
    receipt.lastUpdatedBy = req.user._id;
    await receipt.save();

    await receipt.populate('items.product', 'name sku');

    res.status(200).json({
      success: true,
      message: 'Receipt validated and stock updated successfully',
      data: receipt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating receipt',
      error: error.message,
    });
  }
};

// @desc    Delete receipt
// @route   DELETE /api/receipts/:id
// @access  Private (Admin, Inventory Manager)
exports.deleteReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found',
      });
    }

    if (receipt.status === 'Done') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a completed receipt',
      });
    }

    await receipt.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Receipt deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting receipt',
      error: error.message,
    });
  }
};
