const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    supplier: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true,
    },
    expectedDate: {
      type: Date,
      required: [true, 'Expected delivery date is required'],
    },
    receivedDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['Draft', 'Waiting', 'Received', 'Done'],
      default: 'Draft',
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        expectedQty: {
          type: Number,
          required: true,
          min: 0,
        },
        receivedQty: {
          type: Number,
          default: 0,
          min: 0,
        },
        qualityStatus: {
          type: String,
          enum: ['Pass', 'Fail', 'Pending'],
          default: 'Pending',
        },
        notes: {
          type: String,
          default: '',
        },
      },
    ],
    referenceNumber: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for total items
receiptSchema.virtual('totalItems').get(function () {
  return this.items.reduce((sum, item) => sum + item.receivedQty, 0);
});

// Index for faster queries
receiptSchema.index({ receiptNumber: 1 });
receiptSchema.index({ supplier: 1 });
receiptSchema.index({ status: 1 });
receiptSchema.index({ createdAt: -1 });

// Ensure virtuals are included in JSON
receiptSchema.set('toJSON', { virtuals: true });
receiptSchema.set('toObject', { virtuals: true });

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
