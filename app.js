const express = require('express')
const todoRoutes = require('./routes/todoRoutes')
const cors = require('cors')

const app = express()

// const corsOrigin = process.env.CORS_ORIGIN || 'https://gallery-58b4.onrender.com';
// console.log('🪧  >>> CORS:', corsOrigin);

// const corsOptions = {
//   origin: corsOrigin,
// }

// app.use(cors(corsOptions));
app.use(cors())

app.use(express.json())

app.use('/todos', todoRoutes)

app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({ message: err.message })
})

module.exports = app
