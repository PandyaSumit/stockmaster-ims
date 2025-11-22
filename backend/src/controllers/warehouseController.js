const Warehouse = require('../models/Warehouse');

// @desc    Get all warehouses
// @route   GET /api/warehouses
// @access  Private
exports.getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find()
      .populate('manager', 'name email')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: warehouses.length,
      data: warehouses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching warehouses',
      error: error.message,
    });
  }
};

// @desc    Get single warehouse
// @route   GET /api/warehouses/:id
// @access  Private
exports.getWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id).populate('manager', 'name email');

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    res.status(200).json({
      success: true,
      data: warehouse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching warehouse',
      error: error.message,
    });
  }
};

// @desc    Create warehouse
// @route   POST /api/warehouses
// @access  Private (Admin)
exports.createWarehouse = async (req, res) => {
  try {
    const { name, code, location, capacity, manager } = req.body;

    // Validate required fields
    if (!name || !code || !location?.address || !location?.city || !location?.state || !location?.country) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if warehouse with same name or code already exists
    const existingWarehouse = await Warehouse.findOne({
      $or: [{ name }, { code: code.toUpperCase() }],
    });

    if (existingWarehouse) {
      if (existingWarehouse.name === name) {
        return res.status(400).json({
          success: false,
          message: 'Warehouse with this name already exists',
        });
      }
      if (existingWarehouse.code === code.toUpperCase()) {
        return res.status(400).json({
          success: false,
          message: 'Warehouse with this code already exists',
        });
      }
    }

    // Create warehouse
    const warehouse = await Warehouse.create({
      name,
      code: code.toUpperCase(),
      location,
      capacity: capacity || null,
      manager: manager || null,
    });

    // Populate manager before sending response
    await warehouse.populate('manager', 'name email');

    res.status(201).json({
      success: true,
      message: 'Warehouse created successfully',
      data: warehouse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating warehouse',
      error: error.message,
    });
  }
};

// @desc    Update warehouse
// @route   PUT /api/warehouses/:id
// @access  Private (Admin)
exports.updateWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    const { name, code, location, capacity, manager, isActive } = req.body;

    // Check if new name or code conflicts with existing warehouse
    if (name && name !== warehouse.name) {
      const existingWarehouse = await Warehouse.findOne({ name });
      if (existingWarehouse) {
        return res.status(400).json({
          success: false,
          message: 'Warehouse with this name already exists',
        });
      }
    }

    if (code && code.toUpperCase() !== warehouse.code) {
      const existingWarehouse = await Warehouse.findOne({ code: code.toUpperCase() });
      if (existingWarehouse) {
        return res.status(400).json({
          success: false,
          message: 'Warehouse with this code already exists',
        });
      }
    }

    // Update fields
    warehouse.name = name || warehouse.name;
    warehouse.code = code ? code.toUpperCase() : warehouse.code;
    warehouse.location = location || warehouse.location;
    warehouse.capacity = capacity !== undefined ? capacity : warehouse.capacity;
    warehouse.manager = manager !== undefined ? manager : warehouse.manager;
    warehouse.isActive = isActive !== undefined ? isActive : warehouse.isActive;

    await warehouse.save();

    // Populate manager
    await warehouse.populate('manager', 'name email');

    res.status(200).json({
      success: true,
      message: 'Warehouse updated successfully',
      data: warehouse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating warehouse',
      error: error.message,
    });
  }
};

// @desc    Delete warehouse
// @route   DELETE /api/warehouses/:id
// @access  Private (Admin)
exports.deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    // Check if warehouse has associated products
    const Product = require('../models/Product');
    const productsCount = await Product.countDocuments({ warehouse: req.params.id });

    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete warehouse. It has ${productsCount} associated product(s). Please reassign the products first.`,
      });
    }

    await warehouse.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Warehouse deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting warehouse',
      error: error.message,
    });
  }
};
