# Add the PATCH /todos endpoint

## Write the basic updateTodo controller function

The `PATCH` controller is by far the most complex in its basic structure, validation and error handling.

```javascript
exports.updateTodo = async (req, res, next) => {
  const { id } = req.params
  const updates = req.body
  const { task, completed } = req.body
  try {
    const todo = await Todo.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
    res.status(200).json(todo)
  } catch (error) {
    next(error)
  }
}
```

## Add validation for updateTodo

The `_id` property passed in as a param to update a todo, but also there should be a `task` and/or `completed` property passed in through the request body object. We will need to validate and handle errors for:

- the `_id` passed in as a param is a valid MongoDB ID
- there is a todo with that `_id` in the database
- `req.body` is a JS object
- `task` is not an empty string if `task` is passed in
- there is either a `task` or `completed` property in `req.body`
- `task` is a string if `task` is passed in
- `completed` is a boolean if `completed` is passed in

For `_id` being a valid MongoDB ID:

```javascript
if (!mongoose.Types.ObjectId.isValid(id))
  return next({ status: 400, message: `'${id}' is not a valid todo ID` })
```

For no `todo` with that `_id` existing in the database:

```javascript
if (!todo) {
  return next({
    status: 404,
    message: `No todo with ID ${id} was found in the database`,
  })
}
```

For `req.body` being a valid JS object:

```javascript
if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
  return next({
    status: 400,
    message: 'The request body must be a valid JS object',
  })
}
```

**NOTE:** checks that `updates` is not an array since arrays are also an object type.

For the validation of `task` and `completed`, we need to destrcuture the properties from the `req.body`:

```javascript
const { task, completed } = req.body
```

For `task` not being an empty string:

```javascript
if (task === '')
  return next({
    status: 400,
    message:
      'Task cannot be an empty string. If a task property is sent, it must be a valid string',
  })
```

For `task` and/or `completed` being passed into the `req.body`:

```javascript
if (!task && !completed && completed !== false) {
  return next({
    status: 400,
    message: 'Updating a todo requires a task and/or completed property',
  })
}
```

**NOTE:** checks for `task` and `completed` but also that `completed` is not false as this might be read as not present.

For `task` being a string if present:

```javascript
if (task && typeof task !== 'string')
  return next({
    status: 400,
    message: `Task property must be a string. Received type ${typeof task}`,
  })
```

For `completed` being a Boolean if present:

```javascript
if (completed && typeof completed !== 'boolean')
  return next({
    status: 400,
    message: `Completed property must be a Boolean. Received type ${typeof completed}`,
  })
```

There is a logical order to these checks though not all are important.
**NOTE:** the check for `task` being an empty string should come before any other checks about `task` and `completed` to operate as expected since the empty string is a `falsey` value.

```javascript
exports.updateTodo = async (req, res, next) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next({ status: 400, message: `'${id}' is not a valid todo ID` })
  }
  const updates = req.body
  if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
    return next({
      status: 400,
      message: 'The request body must be a valid JS object',
    })
  }
  const { task, completed } = req.body
  if (task === '')
    return next({
      status: 400,
      message:
        'Task cannot be an empty string. If a task property is sent, it must be a valid string',
    })
  if (!task && !completed && completed !== false) {
    return next({
      status: 400,
      message: 'Updating a todo requires a task and/or completed property',
    })
  }
  if (task && typeof task !== 'string')
    return next({
      status: 400,
      message: `Task property must be a string. Received type ${typeof task}`,
    })
  if (completed && typeof completed !== 'boolean')
    return next({
      status: 400,
      message: `Completed property must be a Boolean. Received type ${typeof completed}`,
    })
  try {
    const todo = await Todo.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
    if (!todo) {
      return next({
        status: 404,
        message: `No todo with ID ${id} was found in the database`,
      })
    }
    res.status(200).json(todo)
  } catch (error) {
    next(error)
  }
}
```

## Adding the POST /todos route

Start by importing the `updateTodo` function into `todoRoutes.js` by adding it to the current import from `todoController.js`:

```javascript
const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
} = require('../controllers/todoController')
```

And add the new route:

```javascript
router.delete('/', updateTodo)
```

And as before, there is no need to add anything to `app.js`.

[NEXT: Add updateTodo controller happy path unit tests](6b_updateTodo_happyPathUnitTests.md)
