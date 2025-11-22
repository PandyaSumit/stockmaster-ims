const Delivery = require('../models/Delivery');
const Product = require('../models/Product');

// Generate unique delivery number
const generateDeliveryNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `DEL-${year}-`;

  const lastDelivery = await Delivery.findOne({ deliveryNumber: new RegExp(`^${prefix}`) })
    .sort({ deliveryNumber: -1 })
    .limit(1);

  let sequence = 1;
  if (lastDelivery) {
    const lastSequence = parseInt(lastDelivery.deliveryNumber.replace(prefix, ''));
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  return `${prefix}${sequence.toString().padStart(3, '0')}`;
};

// @desc    Get all deliveries
// @route   GET /api/deliveries
// @access  Private
exports.getDeliveries = async (req, res) => {
  try {
    const { status, customer, startDate, endDate, search } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (customer) {
      query.customer = { $regex: customer, $options: 'i' };
    }

    if (startDate || endDate) {
      query.deliveryDate = {};
      if (startDate) query.deliveryDate.$gte = new Date(startDate);
      if (endDate) query.deliveryDate.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { deliveryNumber: { $regex: search, $options: 'i' } },
        { customer: { $regex: search, $options: 'i' } },
      ];
    }

    const deliveries = await Delivery.find(query)
      .populate('items.product', 'name sku')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching deliveries',
      error: error.message,
    });
  }
};

// @desc    Get single delivery
// @route   GET /api/deliveries/:id
// @access  Private
exports.getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('items.product', 'name sku unitOfMeasure currentStock')
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email');

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found',
      });
    }

    res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery',
      error: error.message,
    });
  }
};

// @desc    Create delivery
// @route   POST /api/deliveries
// @access  Private
exports.createDelivery = async (req, res) => {
  try {
    const { customer, deliveryAddress, deliveryDate, items, notes } = req.body;

    if (!customer || !deliveryAddress || !deliveryDate || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Validate all products exist and check stock availability
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.product} not found`,
        });
      }

      if (product.currentStock < item.requestedQty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.currentStock}, Requested: ${item.requestedQty}`,
        });
      }
    }

    const deliveryNumber = await generateDeliveryNumber();

    const delivery = await Delivery.create({
      deliveryNumber,
      customer,
      deliveryAddress,
      deliveryDate,
      items,
      notes: notes || '',
      createdBy: req.user._id,
      lastUpdatedBy: req.user._id,
    });

    await delivery.populate('items.product', 'name sku');

    res.status(201).json({
      success: true,
      message: 'Delivery created successfully',
      data: delivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating delivery',
      error: error.message,
    });
  }
};

// @desc    Update delivery
// @route   PUT /api/deliveries/:id
// @access  Private
exports.updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found',
      });
    }

    if (delivery.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a completed delivery',
      });
    }

    const { customer, deliveryAddress, deliveryDate, items, status, notes, trackingNumber } =
      req.body;

    if (customer) delivery.customer = customer;
    if (deliveryAddress) delivery.deliveryAddress = deliveryAddress;
    if (deliveryDate) delivery.deliveryDate = deliveryDate;
    if (items) delivery.items = items;
    if (status) delivery.status = status;
    if (notes !== undefined) delivery.notes = notes;
    if (trackingNumber !== undefined) delivery.trackingNumber = trackingNumber;

    delivery.lastUpdatedBy = req.user._id;

    await delivery.save();
    await delivery.populate('items.product', 'name sku');

    res.status(200).json({
      success: true,
      message: 'Delivery updated successfully',
      data: delivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating delivery',
      error: error.message,
    });
  }
};

// @desc    Validate delivery (deduct stock)
// @route   PUT /api/deliveries/:id/validate
// @access  Private (Admin, Inventory Manager)
exports.validateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id).populate('items.product');

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found',
      });
    }

    if (delivery.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Delivery already validated',
      });
    }

    // Check stock availability before deducting
    for (const item of delivery.items) {
      const product = await Product.findById(item.product._id);
      if (product.currentStock < item.pickedQty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.currentStock}, Required: ${item.pickedQty}`,
        });
      }
    }

    // Deduct stock for each item
    for (const item of delivery.items) {
      const product = await Product.findById(item.product._id);
      product.currentStock -= item.pickedQty;
      product.lastUpdatedBy = req.user._id;
      await product.save();
    }

    // Update delivery status
    delivery.status = 'Delivered';
    delivery.lastUpdatedBy = req.user._id;
    await delivery.save();

    await delivery.populate('items.product', 'name sku');

    res.status(200).json({
      success: true,
      message: 'Delivery validated and stock updated successfully',
      data: delivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating delivery',
      error: error.message,
    });
  }
};

// @desc    Delete delivery
// @route   DELETE /api/deliveries/:id
// @access  Private (Admin, Inventory Manager)
exports.deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found',
      });
    }

    if (delivery.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a completed delivery',
      });
    }

    await delivery.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Delivery deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting delivery',
      error: error.message,
    });
  }
};
