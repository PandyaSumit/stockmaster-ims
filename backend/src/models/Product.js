const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    unitOfMeasure: {
      type: String,
      required: [true, 'Unit of measure is required'],
      enum: {
        values: ['kg', 'grams', 'liters', 'ml', 'pieces', 'boxes', 'packs', 'meters', 'cm'],
        message: '{VALUE} is not a valid unit of measure',
      },
    },
    currentStock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    reorderLevel: {
      type: Number,
      required: [true, 'Reorder level is required'],
      min: [0, 'Reorder level cannot be negative'],
    },
    maxStockLevel: {
      type: Number,
      default: null,
      min: [0, 'Max stock level cannot be negative'],
    },
    autoReorderEnabled: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      default: null,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for stock status
productSchema.virtual('stockStatus').get(function () {
  if (this.currentStock === 0) return 'out_of_stock';
  if (this.currentStock <= this.reorderLevel) return 'low_stock';
  return 'in_stock';
});

// Virtual for suggested order quantity
productSchema.virtual('suggestedOrderQty').get(function () {
  if (!this.maxStockLevel) return 0;
  if (this.currentStock <= this.reorderLevel) {
    return Math.max(0, this.maxStockLevel - this.currentStock);
  }
  return 0;
});

// Indexes for better query performance
productSchema.index({ sku: 1 });
productSchema.index({ name: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ warehouse: 1 });
productSchema.index({ currentStock: 1 });
productSchema.index({ createdAt: -1 });

// Pre-save middleware to update lastUpdatedBy
productSchema.pre('save', function (next) {
  if (this.isModified() && !this.isNew) {
    this.lastUpdatedBy = this.createdBy; // Will be updated by controller
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
