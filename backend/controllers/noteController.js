const asyncHandler = require('express-async-handler')

const User = require('../model/userModel')
const Note = require('../model/noteModel')
const Ticket = require('../model/ticketModel')


// @desc Get note for a ticket
// @route GET /api/tickets/:ticketId/notes
// @access Private

const getNotes = asyncHandler(async(req, res) => {

    // Get user using the userId in the JWT
    const user = await User.findById(req.user.id)
    // console.log(`The request id ${user}`);

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    const ticket = await Ticket.findById(req.params.ticketId)
    
        if (ticket.user.toString() !== req.user.id) {
            res.status(401)
            throw new Error("User not authorized")
        }

        const notes = await Note.find({ ticket: req.params.ticketId})

    res.status(200).json(notes )
})


// @desc Create ticket note
// @route POST /api/tickets/:ticketId/notes
// @access Private

const addNotes = asyncHandler(async(req, res) => {

    // Get user using the userId in the JWT
    const user = await User.findById(req.user.id)
    // console.log(`The request id ${user}`);

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    const ticket = await Ticket.findById(req.params.ticketId)
    
        if (ticket.user.toString() !== req.user.id) {
            res.status(401)
            throw new Error("User not authorized")
        }

        const note = await Note.create({ 
            text: req.body.text,
            isStaff: false,
            user: req.user.id,
            ticket: req.params.ticketId
        })

    res.status(200).json(note )
})


module.exports = {
    getNotes,
    addNotes
}