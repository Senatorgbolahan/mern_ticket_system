const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../model/userModel')

// @desc    Register a new user
// @route   /api/users
// @access  Public
const registerUser = asyncHandler(async(req, res) => {
    // Accept users input
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please include all fields")
    }

    // Find if user already exist
    const userExists = await User.findOne({ email: email })
    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({ name, email, password: hashedPassword })
    if (user) {
        res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})

// @desc    Login a  user
// @route   /api/users/login
// @access  Public
const loginUser = asyncHandler(async(req, res) => {

    const { email, password } = req.body;

    // Check if user email exist
    const user = await User.findOne({ email })

    // compare password
    const comparePassword = await bcrypt.compare(password, user.password)

    // Check user and password match
    if (user && comparePassword) {
        res.status(200).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) })
    } else {
        res.status(401)
        throw new Error("Invalid credentials")
    }
})


const getMe = asyncHandler(async(req, res) => {
    res.status(200).json(req.user);
})


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
}