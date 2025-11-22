const mongoose = require('mongoose');

const adjustmentSchema = new mongoose.Schema(
  {
    adjustmentNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      default: null,
    },
    systemStock: {
      type: Number,
      required: true,
    },
    physicalCount: {
      type: Number,
      required: true,
      min: 0,
    },
    difference: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      enum: [
        'Damaged Goods',
        'Expired Items',
        'Theft/Loss',
        'Counting Error',
        'Return to Supplier',
        'Other',
      ],
      required: [true, 'Reason is required'],
    },
    notes: {
      type: String,
      default: '',
    },
    adjustedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
adjustmentSchema.index({ adjustmentNumber: 1 });
adjustmentSchema.index({ product: 1 });
adjustmentSchema.index({ warehouse: 1 });
adjustmentSchema.index({ createdAt: -1 });

const Adjustment = mongoose.model('Adjustment', adjustmentSchema);

module.exports = Adjustment;
