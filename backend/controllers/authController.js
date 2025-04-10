const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallbackSecret', {
    expiresIn: '30d',
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // Default user creation logic
      if (email === 'intern@dacoid.com' && password === 'Test123') {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          email,
          password: hashedPassword,
        });
        
        
        return res.json({
          _id: newUser._id,
          email: newUser.email,
          token: generateToken(newUser._id),
        });
      }
      
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

exports.seedUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if the credentials match the default values
    if (email !== 'intern@dacoid.com' || password !== 'Test123') {
      return res.status(400).json({ message: 'Invalid credentials for seeding' });
    }

    const userExists = await User.findOne({ email });
    
    if (!userExists) {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = await User.create({
        email,
        password: hashedPassword,
      });
      
      console.log('Seeded user:', { email: newUser.email });
      return res.json({ message: 'User seeded successfully' });
    }
    
    res.json({ message: 'User already exists' });
  } catch (error) {
    console.error('Seed user error:', error);
    res.status(500).json({ message: 'Error seeding user' });
  }
};