require('dotenv').config()
const mongoose = require('mongoose')

const dbPassword = process.env.MONGODB_PASSWORD
const dbUser = process.env.MONGODB_USERNAME
const cluster = process.env.MONGODB_CLUSTER_REF
const dbName = process.env.MONGODB_DATABASE_NAME || 'todo_DEV'

const mongoDbUri = `mongodb+srv://${dbUser}:${dbPassword}@${cluster}.mongodb.net/${dbName}`

const connectToDatabase = async (logSuccess = true) => {
  try {
    await mongoose.connect(mongoDbUri)
    if (logSuccess)
      console.log(
        `🥳 Successfully connected to MongoDB Atlas ${dbName} database! 🌎`,
      )
  } catch (error) {
    console.log(`😖 Unable to connect to MongoDB Atlas ${dbName} database! ❌`)
    console.error(error)
    process.exit(1)
  }
}

module.exports = connectToDatabase
