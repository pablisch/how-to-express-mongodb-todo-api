# Add the DELETE /todos endpoint

## Write the basic deleteTodo controller function

```javascript
exports.deleteTodo = async (req, res, next) => {
  const { id } = req.params
  try {
    const todo = await Todo.findByIdAndDelete(id)
    res
      .status(200)
      .json({ message: `Todo with ID ${id} was successfully deleted` })
  } catch (error) {
    next(error)
  }
}
```

## Add validation for deleteTodo

The `_id` property passed in as a param to delete a todo. We will need to validate and handle errors for:

- the `_id` passed in as a param is a valid MongoDB ID
- there is a todo with that `_id` in the database

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

The valid `_id` check will go after the `_id` is destructured and the 'existing todo' check will go as soon as the call to the database gives a response.

```javascript
exports.deleteTodo = async (req, res, next) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next({ status: 400, message: `'${id}' is not a valid todo ID` })
  }
  try {
    const todo = await Todo.findByIdAndDelete(id)
    if (!todo) {
      return next({
        status: 404,
        message: `No todo with ID ${id} was found in the database`,
      })
    }
    res
      .status(200)
      .json({ message: `Todo with ID ${id} was successfully deleted` })
  } catch (error) {
    next(error)
  }
}
```

## Adding the POST /todos route

Start by importing the `deleteTodo` function into `todoRoutes.js` by adding it to the current import from `todoController.js`:

```javascript
const {
  getAllTodos,
  getTodoById,
  createTodo,
  deleteTodo,
} = require('../controllers/todoController')
```

And add the new route:

```javascript
router.delete('/', deleteTodo)
```

And as before, there is no need to add anything to `app.js`.

[NEXT: Add deleteTodo controller function unit tests](5b_deleteTodo_unitTests.md)
