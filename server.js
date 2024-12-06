const app = require('./app')
const port = process.env.PORT || 3000
const connectToDatabase = require('./db')

;(async () => {
  try {
    await connectToDatabase()
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  } catch (error) {
    console.error('Failed to start the server:', error)
    process.exit(1)
  }
})()
