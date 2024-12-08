# Adding the GET /todos endpoint in app.js and then refactoring

[Jump to final code for this section](#final-code-at-the-end-of-this-section)

## Adding the GET /todos endpoint in app.js

In the app.js file, create the todo route. For example:

```javascript
app.get('/todos', async (req, res, next) => {
  try {
    const todos = await Todo.find()
    res.status(200).json(todos)
  } catch (error) {
    next(error)
  }
})
```

**NOTE:** This is a correct and valid route handler and we could carry on adding route handlers in `app.js` in this way. If we did so, however, `app.js` would soon become a messy, bloated file and so, we generally move the logic into separate controller functions grouped into routes as we will see in a bit.

## Manually test the todo route

In browser or Postman, make a `GET` request to `http://localhost:3000/todos`.

## Create the todo controller function

Import the `Todo` schema from `models` so that controller functions can reference the schema when making database calls.
Import `mongoose` to be able to validate IDs as valid MongoDB IDs.

```javascript
const Todo = require('../models/todo')
const mongoose = require('mongoose')
```

The logic for the todo route should be moved from `app.js` into the controller file, `todoController.js`, in the `controllers` folder.

```javascript
exports.getAllTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find()
    res.status(200).json(todos)
  } catch (error) {
    next(error)
  }
}
```

## Create the todo route

In the routes/todoRoutes.js file, import the express router and the todo controller, create the router, and export it:

```javascript
const { Router } = require('express')
const router = Router()

const { getAllTodos } = require('../controllers/todoController')

module.exports = router
```

Between the imports and export, add the first route:

```javascript
router.get('/', getAllTodos)
```

**NOTE:** The route is now just `/` as the `/todos` endpoint root is handled in the app.js file.

## Import and use the todo route into app.js

In the app.js file, import the todo route as `todoRoutes` with the other imports:

```javascript
const todoRoutes = require('./routes/todoRoutes')
```

Use`todoRoutes` between the single home route and the `next` error handling middleware:

```javascript
app.use('/todos', todoRoutes)
```

## Clean up old todo route code in app.js

Remove this import snippets of old Todo schema from app.js:

```javascript
const Todo = require('../models/todo') // remove this line
```

and the route:

```javascript
app.get('/todos', async (req, res, next) => {
  // remove this section
  try {
    const todos = await Todo.find()
    res.status(200).json(todos)
  } catch (error) {
    next(error)
  }
})
```

At this point, you could also remove the `home` route from app.js, whose purpose was only to test the server was working.

[NEXT: getAllTodos controller function unit tests](2c_getTodos_UnitTests.md)

## Final code at the end of this section

### app.js

```javascript
const express = require('express')
const todoRoutes = require('./routes/todoRoutes')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())

app.use('/todos', todoRoutes)

app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({ message: err.message })
})

module.exports = app
```

### routes/todoRoutes.js

```javascript
const { Router } = require('express')
const router = Router()

const { getAllTodos } = require('../controllers/todoController')

router.get('/', getAllTodos)

module.exports = router
```

### controllers/todoController.js

```javascript
const Todo = require('../models/todo')
const mongoose = require('mongoose')

exports.getAllTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find()
    res.status(200).json(todos)
  } catch (error) {
    next(error)
  }
}
```

[NEXT: getAllTodos controller function unit tests](2c_getTodos_UnitTests.md)
