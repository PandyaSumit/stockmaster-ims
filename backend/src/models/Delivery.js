const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    deliveryNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    customer: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: [true, 'Delivery address is required'],
    },
    deliveryDate: {
      type: Date,
      required: [true, 'Delivery date is required'],
    },
    status: {
      type: String,
      enum: ['Draft', 'Picking', 'Packed', 'Shipped', 'Delivered'],
      default: 'Draft',
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        requestedQty: {
          type: Number,
          required: true,
          min: 0,
        },
        pickedQty: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
    notes: {
      type: String,
      default: '',
    },
    trackingNumber: {
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
deliverySchema.virtual('totalItems').get(function () {
  return this.items.reduce((sum, item) => sum + item.pickedQty, 0);
});

// Index for faster queries
deliverySchema.index({ deliveryNumber: 1 });
deliverySchema.index({ customer: 1 });
deliverySchema.index({ status: 1 });
deliverySchema.index({ createdAt: -1 });

// Ensure virtuals are included in JSON
deliverySchema.set('toJSON', { virtuals: true });
deliverySchema.set('toObject', { virtuals: true });

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
