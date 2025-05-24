const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, username, mobile } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      username,
      mobile
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '7d' }
    );

    // Return user data without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '7d' }
    );

    // Return user data without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Get profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userResponse = req.user.toObject();
    delete userResponse.password;
    
    // Get user statistics
    const stats = await req.user.getStats();
    
    res.json({
      ...userResponse,
      ...stats
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update profile
router.patch('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'username', 'mobile', 'currency'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    updates.forEach(update => {
      req.user[update] = req.body[update];
    });
    await req.user.save();

    const userResponse = req.user.toObject();
    delete userResponse.password;

    // Get updated statistics
    const stats = await req.user.getStats();

    res.json({
      ...userResponse,
      ...stats
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ message: 'Error updating profile' });
  }
});

// Upload profile photo
router.post('/profile/photo', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    
    // Delete old photo if exists
    if (user.profilePhoto) {
      const oldPhotoPath = path.join(__dirname, '..', user.profilePhoto);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    user.profilePhoto = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ profilePhoto: user.profilePhoto });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete profile photo
router.delete('/profile/photo', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.profilePhoto) {
      return res.status(404).json({ error: 'No profile photo found' });
    }

    // Delete photo file
    const photoPath = path.join(__dirname, '..', user.profilePhoto);
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }

    // Remove photo reference from user
    user.profilePhoto = null;
    await user.save();

    res.json({ message: 'Profile photo deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get profile photo
router.get('/profile/photo/:filename', (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(__dirname, '../uploads', filename));
});

module.exports = router; 