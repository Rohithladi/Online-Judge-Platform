const express = require('express');
const router = express.Router();
const { register, login, verifyOtp } = require('../routes/authcontroller');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

// 🔐 Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);

// ✅ Add this: GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
