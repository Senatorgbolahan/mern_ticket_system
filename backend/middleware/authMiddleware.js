const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')


const protect = asyncHandler(async(req, res, next) => {

    // // Check header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error("Authenticated Invalid")
    }

    // Get token from header
    const token = authHeader.split(' ')[1]
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // attached to the user routes
        req.user = await User.findById(decoded.id).select('-password')
            // req.user = { id: decoded.id, name: decoded.name }
        next()
        // console.log(decoded);
    } catch (error) {
        res.status(401)
        throw new Error("Not Authorized")
    }
})

module.exports = { protect };