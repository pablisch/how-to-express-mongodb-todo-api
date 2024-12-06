# Add the POST /todos endpoint

## Write the basic createTodo controller function

```javascript
exports.createTodo = async (req, res, next) => {
  const { task } = req.body
  const todo = new Todo({
    task,
    completed: false,
  })
  try {
    await todo.save()
    res.status(201).json(todo)
  } catch (error) {
    next(error)
  }
}
```

## Add validation for createTodo

The `task` property is all that is needed to create a todo. We will need to validate and handle errors for:

- the `task` property passed in must not be an empty string
- there must be a task passed in
- `task` must be of type `string`
  **NOTE:** Since a check for no `task` will include an empty string as meaning there is no `task`, we need to check for an empty string first if we want to be specific in the error message passed back.

For `task` being an empty string:

```javascript
if (task === '')
  return next({
    status: 400,
    message: 'The task property cannot be an empty string',
  })
```

For no `task` being passed in:

```javascript
if (!task) return next({ status: 400, message: `No task was provided` })
```

For `task` not being a string:

```javascript
if (typeof task !== 'string')
  return next({
    status: 400,
    message: `Task must be a string but type ${typeof task} was given`,
  })
```

These can all go sequentially after the destructuring of `task` resulting in the completed function:

```javascript
exports.createTodo = async (req, res, next) => {
  const { task } = req.body
  if (task === '')
    return next({
      status: 400,
      message: 'The task property cannot be an empty string',
    })
  if (!task) return next({ status: 400, message: `No task was provided` })
  if (typeof task !== 'string')
    return next({
      status: 400,
      message: `Task must be a string but type ${typeof task} was given`,
    })
  const todo = new Todo({
    task,
    completed: false,
  })
  try {
    await todo.save()
    res.status(201).json(todo)
  } catch (error) {
    next(error)
  }
}
```

## Adding the POST /todos route

Start by importing the `createTodo` function into `todoRoutes.js` by adding it to the current import from `todoController.js`:

```javascript
const {
  getAllTodos,
  getTodoById,
  createTodo,
} = require('../controllers/todoController')
```

And add the new route:

```javascript
router.post('/', createTodo)
```

And as before, there is no need to add anything to `app.js`.

[NEXT: Add createTodo controller function unit tests](4b_createTodo_unitTests.md)
