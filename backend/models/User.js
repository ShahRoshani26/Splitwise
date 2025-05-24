const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  mobile: {
    type: String,
    trim: true
  },
  profilePhoto: {
    type: String,
    default: null
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields for groups
userSchema.virtual('groups', {
  ref: 'Group',
  localField: '_id',
  foreignField: 'members'
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get user statistics
userSchema.methods.getStats = async function() {
  const Expense = mongoose.model('Expense');
  const Group = mongoose.model('Group');

  // Get all groups user is part of
  const groups = await Group.find({ members: this._id });
  const groupIds = groups.map(group => group._id);

  // Get current month's start and end dates
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Get all expenses for these groups
  const expenses = await Expense.find({
    group: { $in: groupIds },
    date: { $gte: monthStart, $lte: monthEnd }
  }).populate('splitBetween.user');

  let totalExpenses = 0;
  let totalOwed = 0;
  let totalOwe = 0;
  let settledBalance = 0;

  expenses.forEach(expense => {
    // Calculate total expenses for groups user is part of
    totalExpenses += expense.amount;

    // If user paid for the expense
    if (expense.paidBy.toString() === this._id.toString()) {
      const othersShare = expense.splitBetween
        .filter(split => split.user._id.toString() !== this._id.toString())
        .reduce((sum, split) => sum + split.share, 0);
      totalOwed += othersShare;
    } else {
      // If user needs to pay their share
      const userShare = expense.splitBetween
        .find(split => split.user._id.toString() === this._id.toString())?.share || 0;
      totalOwe += userShare;
    }
  });

  settledBalance = totalOwed - totalOwe;

  // Get last activity
  const lastExpense = await Expense.findOne({
    $or: [
      { paidBy: this._id },
      { 'splitBetween.user': this._id }
    ]
  }).sort({ date: -1 });

  return {
    totalExpenses,
    totalOwed,
    totalOwe,
    settledBalance,
    groupsCount: groups.length,
    lastActivity: lastExpense?.date || this.lastActivity
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User; 