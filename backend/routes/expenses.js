const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Group = require('../models/Group');
const auth = require('../middleware/auth');

// Create a new expense in a group
router.post('/groups/:groupId/expenses', auth, async (req, res) => {
  try {
    // Check if user is member of the group
    const group = await Group.findOne({
      _id: req.params.groupId,
      members: req.user._id
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const expense = new Expense({
      ...req.body,
      group: req.params.groupId,
      paidBy: req.user._id
    });

    await expense.save();
    await expense.populate([
      { path: 'paidBy', select: 'name email username' },
      { path: 'splitBetween.user', select: 'name email username' }
    ]);

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: 'Error creating expense' });
  }
});

// Get all expenses in a group
router.get('/groups/:groupId/expenses', auth, async (req, res) => {
  try {
    // Check if user is member of the group
    const group = await Group.findOne({
      _id: req.params.groupId,
      members: req.user._id
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy', 'name email username')
      .populate('splitBetween.user', 'name email username')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses' });
  }
});

// Get a specific expense
router.get('/expenses/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id })
      .populate('paidBy', 'name email username')
      .populate('splitBetween.user', 'name email username');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check if user is member of the group
    const group = await Group.findOne({
      _id: expense.group,
      members: req.user._id
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expense' });
  }
});

// Update an expense
router.patch('/expenses/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'amount', 'splitBetween', 'category'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      paidBy: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    updates.forEach(update => {
      expense[update] = req.body[update];
    });

    await expense.save();
    await expense.populate([
      { path: 'paidBy', select: 'name email username' },
      { path: 'splitBetween.user', select: 'name email username' }
    ]);

    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: 'Error updating expense' });
  }
});

// Delete an expense
router.delete('/expenses/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      paidBy: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense' });
  }
});

// Get expense summary for a group
router.get('/groups/:groupId/summary', auth, async (req, res) => {
  try {
    // Check if user is member of the group
    const group = await Group.findOne({
      _id: req.params.groupId,
      members: req.user._id
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy', 'name email username')
      .populate('splitBetween.user', 'name email username');

    // Calculate balances
    const balances = {};
    group.members.forEach(member => {
      balances[member.toString()] = 0;
    });

    expenses.forEach(expense => {
      // Add amount to payer's balance
      balances[expense.paidBy._id.toString()] += expense.amount;

      // Subtract shares from each member's balance
      expense.splitBetween.forEach(split => {
        balances[split.user._id.toString()] -= split.share;
      });
    });

    res.json({
      groupTotal: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      balances
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating summary' });
  }
});

module.exports = router; 