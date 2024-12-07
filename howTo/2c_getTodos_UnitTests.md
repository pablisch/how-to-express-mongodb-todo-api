# GET /todos endpoint unit testing the getAllTodos controller function

[Jump to final code for this section](#final-gettodos-unit-test-code)

## import files into the controller test file

In the file, `todoController.test.js`, in the `controllers` folder, import `getAllTodos` and `seedTodos`, import the `Todo` model, and set the environment variable,`MONGODB_DATABASE_NAME` to set the database to the `todo_TEST` database.

**NOTE:** Setting the `MONGODB_DATABASE_NAME` environment variable overrides the default value of `todos_DEV`.

```javascript
process.env.MONGODB_DATABASE_NAME = 'todo_TEST'

const seedTodos = require('../seed/seedTodos')
const { getAllTodos } = require('./todoController')
const Todo = require('../models/todo')
```

### Set up an over-arching `describe` block and `beforeEach` block

```javascript
describe('Todo routes controller functions unit tests', () => {
  beforeEach(async () => {
    await seedTodos(false)
  })
})
```

**NOTE:** the `beforeEach` block calls `seedTodos` to make sure that the database is in a set state before each test with the same three items in it so that each test is independent from all others in a completely controlled environment. The `false` argument passed in is for the `logSuccess` parameter and suppresses any console logging upon successful connection to the database or operation as this does not play nicely with tests. It is also used to stop the `process.exit` which would end the test run.

## Add a describe block for `getAllTodo` tests

```javascript
describe('getAllTodos()', () => {})
```

## Write `getAllTodos` controller 'happy route' tests

```javascript
test('should return an array of all todo objects and status 200', async () => {
  // Arrange
  const mReq = {}
  const mRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  }
  const mNext = jest.fn()

  // Act
  await getAllTodos(mReq, mRes, mNext)

  // Assert
  expect(mRes.status).toBeCalledWith(200)
  const todos = mRes.json.mock.calls[0][0]

  expect(todos.length).toBe(3)
  expect(todos[0].task).toBe('Eat')
  expect(todos[0]).toMatchObject({ task: 'Eat', completed: true })
  expect(todos[1]).toMatchObject({ task: 'Sleep', completed: false })
  expect(todos[2]).toMatchObject({ task: 'Pray', completed: false })

  const now = Date.now()
  todos.forEach((todo) => {
    expect(todo).toHaveProperty('_id')
    expect(todo._id.toString()).toMatch(/^[a-f\d]{24}$/i)
    expect(todo).toHaveProperty('createdAt')
    expect(new Date(todo.createdAt).getTime() < now)
    expect(todo).toHaveProperty('updatedAt')
    expect(new Date(todo.updatedAt).getTime() < now)
  })
})
```

**NOTES:**

- `const todos` is declared to make all following assertions easier to write and read but all following assertions are still referencing `mRes.json.mock.calls[0][0]`
- `mRes.json.mock.calls[0][0]` is the first argument of the first call to the mock `mRes.json` function
  - `mRes.json` is the `jest.fn` mocked simulation of the `res.json` method of the Express response object
  - `mRes.json` is expected to be called by `getAllTodos()` with an array of todos as an argument
  - `mRes.json` has a `mock` property that stores information about how the mock was called including:
    - **calls**: and array representing each call to the mocked function containing the arguments passed to it
    - **instances**: information about how the function was instantiated
- `mRes.json.mock.calls` is an array of arrays where:
  - Each inner array represents one call to the mock function
  - Each element in an inner array is an argument passed during that call, e.g. an array of todos
- `mRes.json.mock.calls[0]` is the first call made to the mock `mRes.json` function.
  - In most tests, this is the only call we care about and the only one made
  - It contains an array of arguments passed to the mock function, in this case, the first and only, is an array of todos
- `mRes.json.mock.calls[0]` is the array of todos passed into the mock function as the first (and only) argument of the first (and only) call to the mock function

- The most basic assertions here are:
  - the `length`, i.e. the number of elements in the array of todos
  - the `task` property of an array element
  - a partial match of an array element:
    - `expect(todos[0]).toMatchObject({ task: 'Eat', completed: true })` does not compare and object but asserts that the properties and value are contained within an object.
    - This means that there is no need for us to know other properties, e.g. the `createdAt` value
- Further, more general, assertions are:
  - that each todo has:
    - an `_id` property that matches the MongoDB id object pattern
    - a `createdAt` property that has a value earlier than the time now
    - an `updatedAt` property that has a value earlier than the time now

## Run the unit tests

```bash
npm test
```

**NOTE:** For all other controller functions there will be validation and error handling tests but there really isn't anything that _should_ go wrong with the basic `GET` route that returns all items. Any server errors will be handled by the `next` middleware.

[NEXT: GET /todos endpoint integration tests](2d_getTodos_integrationTests.md)

### Final getTodos unit test code

```javascript
process.env.MONGODB_DATABASE_NAME = 'todo_TEST'

const seedTodos = require('../seed/seedTodos')
const { getAllTodos } = require('./todoController')
const Todo = require('../models/todo')

describe('Todo routes controller functions unit tests', () => {
  beforeEach(async () => {
    await seedTodos(false)
  })

  describe('getAllTodos()', () => {
    test('should return an array of all todo objects and status 200', async () => {
      // Arrange
      const mReq = {}
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mNext = jest.fn()

      // Act
      await getAllTodos(mReq, mRes, mNext)

      // Assert
      expect(mRes.status).toBeCalledWith(200)
      const todos = mRes.json.mock.calls[0][0]

      expect(todos.length).toBe(3)
      expect(todos[0].task).toBe('Eat')
      expect(todos[0]).toMatchObject({ task: 'Eat', completed: true })
      expect(todos[1]).toMatchObject({ task: 'Sleep', completed: false })
      expect(todos[2]).toMatchObject({ task: 'Pray', completed: false })

      const now = Date.now()
      todos.forEach((todo) => {
        expect(todo).toHaveProperty('_id')
        expect(todo._id.toString()).toMatch(/^[a-f\d]{24}$/i)
        expect(todo).toHaveProperty('createdAt')
        expect(todo).toHaveProperty('updatedAt')
        expect(new Date(todo.createdAt).getTime() < now)
        expect(new Date(todo.updatedAt).getTime() < now)
      })
    })
  })
})
```

[NEXT: GET /todos endpoint integration tests](2d_getTodos_integrationTests.md)
