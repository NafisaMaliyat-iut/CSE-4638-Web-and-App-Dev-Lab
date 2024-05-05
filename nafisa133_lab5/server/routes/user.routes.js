const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.models');

router.post('/signup', async (req, res) => {
  console.log(req.body?.email)
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      email: req.body.email,
      password: hashedPassword 
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  console.log(req.body)
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
