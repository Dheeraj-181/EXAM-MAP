const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { seedUserData } = require('../seed/jntuaData');

// Generate JWT token
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'exammap_super_secret_jwt_key_2026_jntua',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  };

  // Safe user representation (omit password)
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    college: user.college,
    branch: user.branch,
    semester: user.semester,
    targetExamPeriod: user.targetExamPeriod,
    dailyStudyGoalHours: user.dailyStudyGoalHours,
    createdAt: user.createdAt,
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    message,
    token,
    user: userData,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, college, branch, semester } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please login.',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      college: college || 'School of Computer Science & Engineering',
      branch: branch || 'Computer Science & Engineering',
      semester: semester || 'Semester 5',
    });

    // Auto-seed sample JNTUA CSE curriculum
    try {
      await seedUserData(user._id);
      user.hasSeededDefaultData = true;
      await user.save();
    } catch (seedErr) {
      console.warn('Initial syllabus seed failed non-critically:', seedErr.message);
    }

    sendTokenResponse(user, 201, res, 'Registration successful! Welcome to ExamMap.');
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password presence
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    // Check for user (explicitly selecting password)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    sendTokenResponse(user, 200, res, 'Login successful!');
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, college, branch, semester, targetExamPeriod, dailyStudyGoalHours } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (college !== undefined) fieldsToUpdate.college = college;
    if (branch !== undefined) fieldsToUpdate.branch = branch;
    if (semester !== undefined) fieldsToUpdate.semester = semester;
    if (targetExamPeriod !== undefined) fieldsToUpdate.targetExamPeriod = targetExamPeriod;
    if (dailyStudyGoalHours !== undefined) fieldsToUpdate.dailyStudyGoalHours = dailyStudyGoalHours;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new passwords',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
};

// @desc    Reset/reseed sample JNTUA syllabus data
// @route   POST /api/auth/reseed
// @access  Private
exports.reseedData = async (req, res, next) => {
  try {
    const Subject = require('../models/Subject');
    const Topic = require('../models/Topic');
    const StudyPlan = require('../models/StudyPlan');
    const Exam = require('../models/Exam');

    // Remove existing data for this user
    await Subject.deleteMany({ user: req.user.id });
    await Topic.deleteMany({ user: req.user.id });
    await StudyPlan.deleteMany({ user: req.user.id });
    await Exam.deleteMany({ user: req.user.id });

    // Seed again
    await seedUserData(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Successfully loaded core computer science sample syllabus!',
    });
  } catch (err) {
    next(err);
  }
};
