const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    loginId: {
      type: String,
      required: [true, 'Login ID is required'],
      unique: true,
      trim: true,
      minlength: [6, 'Login ID must be between 6-12 characters'],
      maxlength: [12, 'Login ID must be between 6-12 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Login ID can only contain letters, numbers, and underscores']
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ['Admin', 'Inventory Manager', 'Warehouse Staff'],
      default: 'Warehouse Staff',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: null
    },
    refreshTokens: [{
      token: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    passwordChangedAt: Date,
    passwordResetOTP: String,
    passwordResetExpires: Date
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Create indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ loginId: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
