# Setting the todo schema and writing seed data

[Jump to final code for this section](#final-code-for-this-section)

Since our server is all about connecting to a database and managing `todos` we will need a `todo` schema and seed data.

## Creating the todo schema

In `models/todo.js`, import `mongoose`.

```javascript
const mongoose = require('mongoose')
```

And create the schema model for `todos`:

```javascript
const todoSchema = new mongoose.Schema(
  {
    task: { type: String, required: true },
    completed: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
)
```

Finally, export the schema:

```javascript
module.exports = mongoose.model('Todo', todoSchema)
```

**NOTES:**

- `Mongoose` is an Object Document Mapper for MongoDB and Node, which makes it easier to work with a NoSQL database such as MongoDB
- `todoSchema` is a new `mongoose.Schema` object
- The `todoSchema` `mongoose.Schema` object takes two arguments:
  - The `task` and `completed` properties, both of which are required in this case
  - `timestamps` which automatically creates `createdAt` and `updatedAt` properties which will be managed by Mongoose
- The export creates a new `mongoose.model` named `Todo` defined by `todoSchema`
- The `Todo` model will be used in CRUD operations, e.g. `const todo = new Todo({...})`

## Creating the seed data

This can be whatever you want or require, based on the schema we have just written, i.e. containing a `task` and `completed` property.

**NOTE:** MongoDB will automatically assign an `_id` property to any new object but since we will want to refer to the id property in tests, for the seed data, we will include the `_id`

Example for `todosSeedData.js`:

```javascript
const todosSeedData = [
  {
    _id: '123456789012345678901234',
    task: 'Eat',
    completed: true,
  },
  {
    _id: '234567890123456789012345',
    task: 'Sleep',
    completed: false,
  },
  {
    _id: '345678901234567890123456',
    task: 'Pray',
    completed: false,
  },
]

module.exports = todosSeedData
```

[NEXT: Setting up a database connection as a function](1e_setUp_databaseConnection.md)

## Final code for this section

### Final models/todo.js code

```javascript
const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema(
  {
    task: { type: String, required: true },
    completed: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Todo', todoSchema)
```

### The final seed/todosSeedData.js code

```javascript
const todosSeedData = [
  {
    _id: '123456789012345678901234',
    task: 'Eat',
    completed: true,
  },
  {
    _id: '234567890123456789012345',
    task: 'Sleep',
    completed: false,
  },
  {
    _id: '345678901234567890123456',
    task: 'Pray',
    completed: false,
  },
]

module.exports = todosSeedData
```

[NEXT: Setting up a database connection as a function](1e_setUp_databaseConnection.md)
