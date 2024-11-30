const express = require('express')
require('dotenv').config();
const todoRoutes = require('./routes/todoRoutes')
const mongoose = require("mongoose");
const cors = require('cors');
const Todo = require("./models/todo");

const dbPassword = process.env.MONGODB_PASSWORD;
const dbUser = process.env.MONGODB_USERNAME;
const cluster = process.env.MONGODB_CLUSTER_REF;
const dbName = process.env.MONGODB_DATABASE_NAME || 'todo_DEV';

const mongoDbUri = `mongodb+srv://${dbUser}:${dbPassword}@${cluster}.mongodb.net/${dbName}`;

const app = express()

// const corsOrigin = process.env.CORS_ORIGIN || 'https://gallery-58b4.onrender.com';
// console.log('🪧  >>> CORS:', corsOrigin);

// const corsOptions = {
//   origin: corsOrigin,
// }

// app.use(cors(corsOptions));
app.use(cors());

mongoose
    .connect(mongoDbUri)
    .then(() => {
      // console.log(
          // `🥳 Successfully connected to MongoDB Atlas ${dbName} database! 🌎`
      // )
    })
    .catch((error) => {
      console.log(`😖 Unable to connect to MongoDB Atlas ${dbName} database! ❌`);
      console.error(error);
    })

app.use(express.json())

app.use('/todos', todoRoutes)

app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({ message: err.message })
})

module.exports = app