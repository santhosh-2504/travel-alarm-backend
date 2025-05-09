import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || password !== confirmPassword)
    return res.status(400).json({ message: 'Invalid data' });

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(409).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: 'User registered' });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user._id);
  res.status(200).json({ token });
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.status(200).json(user);
};
