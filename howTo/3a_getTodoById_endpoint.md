# Add the GET /todos/:id endpoint

## Write the basic getTodoById controller function

```javascript
exports.getTodoById = async (req, res, next) => {
  const { id } = req.params
  try {
    const todo = await Todo.findById(id)
    res.status(200).json(todo)
  } catch (error) {
    next(error)
  }
}
```

## Add validation for createTodo

The `_id` property is all that is needed to find a single todo with a specific `id`. We will need to validate and handle errors for:

- the `_id` passed in as a param is a valid MongoDB ID.
- there is a todo with that `_id` in the database

The `_id` is a unique `ObjectId`, `_id`. It has a defined structure which is not really important here but the `ObjectId` is a 24 character hexadecimal string which can be programmatically validated. Since we are using Mongoose, we can use its built in functions to simplify `_id` validation:

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

Other server errors will be handled by the `next` middleware.

The `getTodoById` controller with validation and error handling looks like this:

```javascript
exports.getTodoById = async (req, res, next) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return next({ status: 400, message: `'${id}' is not a valid todo ID` })
  try {
    const todo = await Todo.findById(id)
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

## Adding the GET /todos/:id route

Start by importing the `getTodoById` function into `todoRoutes.js` by adding it to the current import from `todoController.js`:

```javascript
const { getAllTodos, getTodoById } = require('../controllers/todoController')
```

And add the new route:

```javascript
router.get('/:id', getTodoById)
```

`router` is already being exported so nothing needs to be added there.

**NOTE:** Since we have `app.use('/todos', todoRoutes)` in `app.js`, nothing needs to be added there either.

[NEXT: getTodoById controller unit tests](3b_getTodoById_unitTests.md)
