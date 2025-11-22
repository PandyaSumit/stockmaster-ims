const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Warehouse name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Warehouse name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Warehouse code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      zipCode: {
        type: String,
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        default: 'USA',
      },
    },
    capacity: {
      type: Number,
      default: null,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
warehouseSchema.index({ name: 1 });
warehouseSchema.index({ code: 1 });
warehouseSchema.index({ isActive: 1 });

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;
