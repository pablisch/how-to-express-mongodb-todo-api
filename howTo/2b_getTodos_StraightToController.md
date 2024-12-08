# Adding the GET /todos endpoint as controller function and route

## Adding the getAllTodos controller function

In the controller file, `todoController.js`, in the `controllers` folder, start by adding imports for `mongoose` and the `Todo` schema model:

```javascript
const Todo = require('../models/todo')
const mongoose = require('mongoose')
```

Then, add the simple controller function

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

**NOTE:** The route is just `/` as the `/todos` endpoint root is handled in the app.js file.

## Import and use the todo route into app.js

In the app.js file, import the todo route as `todoRoutes` with the other imports:

```javascript
const todoRoutes = require('./routes/todoRoutes')
```

Use`todoRoutes` between the single home route and the `next` error handling middleware:

```javascript
app.use('/todos', todoRoutes)
```

The `app.js` file should now look ike this:

```javascript
const express = require('express')
const todoRoutes = require('./routes/todoRoutes')

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
