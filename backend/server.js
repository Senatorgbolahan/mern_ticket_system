const express = require('express')
require('dotenv').config()
const app = express()
const colors = require('colors')
const { errorHandler } = require('./middleware/errorMiddleware')
const path = require('path')


const userRoute = require('./routes/userRoutes')
const ticketRoute = require('./routes/ticketRoutes')

// Database
const connectDB = require('./db/dBase')
connectDB()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: false }))




// Routes
app.use('/api/users', userRoute)
app.use('/api/tickets', ticketRoute)

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
    // Set build folder as static
    app.use(express.static(path.join(__dirname, '../frontend/build')))
  
    // FIX: below code fixes app crashing on refresh in deployment
    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
    })
  } else {
    app.get('/', (_, res) => {
      res.status(200).json({ message: 'Welcome to the Support Desk MERN' })
    })
  }

// Error handler
app.use(errorHandler)

app.listen(PORT, console.log(`Server started on port ${PORT}`))