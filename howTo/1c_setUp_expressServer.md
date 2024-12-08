# Setting up the basic Express server

In the app.js file, create the Express server, set up some basic middleware and a test home route. For example:

```javascript
const express = require('express')

const app = express()

app.use(cors())

app.use(express.json())

app.get('/', (req, res, next) => {
  try {
    res.status(200).json({ message: 'Home endpoint is working!' })
  } catch (error) {
    next(error)
  }
})

app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({ message: err.message })
})

module.exports = app
```

In the server.js file, start the server. For example:

```javascript
const app = require('./app')
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

## Write scripts for starting the server and running tests

In the package.json file, add the following scripts:

```
"scripts": {
  "start": "node --watch server.js",
}
```

## Start the server

```bash
npm start
```

[NEXT: Creating a todos schema and seed data file](1d_setUp_todoSchemaAndSeeds.md)

OR see below for explanation of the server code using code comments:

## Server code commented

### app.js

```javascript
const express = require('express')
// import the Express framework for building Node APIs

const app = express()
// declare `app` as an instance of Express

app.use(cors())
// Uses the default CORS setting which is to enable CORS for all routes allowing access from all origins

app.use(express.json())
// use json middleware to parse incoming JSON payloads. req.body will contain the parsed JSON object

app.get('/', (req, res, next) => {
  // defines a route handler for a GET request at the root URL of '/'
  // the route handler takes a second argument - req, res and next
  try {
    // a try block is used to handle errors
    res.status(200).json({ message: 'Home endpoint is working!' })
    // the server responds with a response status of 200 and a JSON object with a message
  } catch (error) {
    // server errors are caught by catch
    next(error)
    // in case of errors, the next middleware is called with the error
  }
})

app.use((err, req, res, next) => {
  // next middleware id configured to handle errors
  const status = err.status || 500
  // the status will be the status property of err if given or 500 by default
  res.status(status).json({ message: err.message })
  // the response status and err.message are returned in the repsonse body
})

module.exports = app
// app is exported
```

### server.js

```javascript
const app = require('./app')
// app, an instance of Express, is imported from app.js
const PORT = process.env.PORT || 3000
// the port number is defined as the environment variable, PORT, or 3000 if none is defined

app.listen(PORT, () => {
  // app is started with two arguments:
  // - the port number defined earlier
  // - a callback function that console logs a message to confirm the app is running
  console.log(`Server running on port ${PORT}`)
})
```

[NEXT: Creating a todos schema and seed data file](1d_setUp_todoSchemaAndSeeds.md)
