const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const auth = require('../middleware/auth');

// Create a new group
router.post('/', auth, async (req, res) => {
  try {
    const group = new Group({
      ...req.body,
      members: [req.user._id], // Add creator as first member
      createdBy: req.user._id
    });
    await group.save();
    await group.populate('members', 'name email username');
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ message: 'Error creating group' });
  }
});

// Get all groups for a user
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('members', 'name email username')
      .populate('createdBy', 'name email username');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

// Get a specific group
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, members: req.user._id })
      .populate('members', 'name email username')
      .populate('createdBy', 'name email username');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group' });
  }
});

// Update a group
router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'description'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user._id });
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    updates.forEach(update => {
      group[update] = req.body[update];
    });
    await group.save();
    await group.populate('members', 'name email username');
    res.json(group);
  } catch (error) {
    res.status(400).json({ message: 'Error updating group' });
  }
});

// Add member to group
router.post('/:id/members', auth, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, members: req.user._id });
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.members.includes(req.body.userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    group.members.push(req.body.userId);
    await group.save();
    await group.populate('members', 'name email username');
    res.json(group);
  } catch (error) {
    res.status(400).json({ message: 'Error adding member' });
  }
});

// Remove member from group
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, createdBy: req.user._id });
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot remove group creator' });
    }

    group.members = group.members.filter(member => member.toString() !== req.params.userId);
    await group.save();
    await group.populate('members', 'name email username');
    res.json(group);
  } catch (error) {
    res.status(400).json({ message: 'Error removing member' });
  }
});

module.exports = router; 