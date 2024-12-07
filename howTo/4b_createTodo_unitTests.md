# Write createTodo controller function unit tests

[Jump to complete test code](#final-createtodo-unit-test-code)

Add the `createTodo` function to the existing imports:

```javascript
const { getAllTodos, getTodoById, createTodo } = require('./todoController')
```

Within the over-arching `describe('Todo routes controller functions unit tests')` block, add a `describe` block for the `createTodo` function:

```javascript
describe('createTodo()', () => {})
```

## Add 'happy route' unit tests

```javascript
test.each(['Climb', 'Swim', 'Climb a tree'])(
  'should add a todo to the database and return the new todo and status 201 when passed task: "%s"',
  async (task) => {
    // Arrange
    const mReq = {
      body: {
        task,
      },
    }
    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const mNext = jest.fn()

    // Act
    await createTodo(mReq, mRes, mNext)

    // Assert
    expect(mRes.status).toHaveBeenCalledWith(201)
    const newTodo = mRes.json.mock.calls[0][0]
    expect(newTodo.task).toBe(task)
    expect(newTodo.completed).toBe(false)
  },
)
```

**NOTE:** Whilst we are checking that the API returns a todo object that is what we expect it to be, i.e. the `task` that we passed in and a `completed`
property value of `false`, the test could go further by calling the using the returned `_id`, calling the `GET /todos/:id` endpoint and asserting that the `todo` does exist in the database.

## Unit testing validation and error handling

Test validation and error handling for:

- `task` being and empty string
- no `task`
- `task` not being a string

```javascript
test.each([
  [undefined, 'No task was provided'],
  ['', 'The task property cannot be an empty string'],
  [212, 'Task must be a string but type number was given'],
  [true, 'Task must be a string but type boolean was given'],
])(
  'should return status 400 and an appropriate error message when passed task: "%s"',
  async (task, errorMessage) => {
    // Arrange
    const mReq = {
      body: {
        task,
      },
    }
    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const mNext = jest.fn()

    // Act
    await createTodo(mReq, mRes, mNext)

    // Assert
    expect(mRes.status).not.toHaveBeenCalled()
    expect(mNext).toHaveBeenCalledWith({ status: 400, message: errorMessage })
    const createTodoCall = mNext.mock.calls[0][0]
    expect(createTodoCall.status).toBe(400)
    expect(createTodoCall.message).toBe(errorMessage)
  },
)
```

[NEXT: POST /todos integration tests](4c_createTodo_integrationTests.md)

### Final createTodo unit test code

```javascript
describe('createTodo()', () => {
  test.each(['Climb', 'Swim', 'Climb a tree'])(
    'should add a todo to the database and return the new todo and status 201 when passed task: "%s"',
    async (task) => {
      // Arrange
      const mReq = {
        body: {
          task,
        },
      }
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mNext = jest.fn()

      // Act
      await createTodo(mReq, mRes, mNext)

      // Assert
      expect(mRes.status).toHaveBeenCalledWith(201)
      const newTodo = mRes.json.mock.calls[0][0]
      expect(newTodo.task).toBe(task)
      expect(newTodo.completed).toBe(false)
    },
  )

  test.each([
    [undefined, 'No task was provided'],
    ['', 'The task property cannot be an empty string'],
    [212, 'Task must be a string but type number was given'],
    [true, 'Task must be a string but type boolean was given'],
  ])(
    'should return status 400 and an appropriate error message when passed task: "%s"',
    async (task, errorMessage) => {
      // Arrange
      const mReq = {
        body: {
          task,
        },
      }
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mNext = jest.fn()

      // Act
      await createTodo(mReq, mRes, mNext)

      // Assert
      expect(mRes.status).not.toHaveBeenCalled()
      expect(mNext).toHaveBeenCalledWith({ status: 400, message: errorMessage })
      const createTodoCall = mNext.mock.calls[0][0]
      expect(createTodoCall.status).toBe(400)
      expect(createTodoCall.message).toBe(errorMessage)
    },
  )
})
```

[NEXT: POST /todos integration tests](4c_createTodo_integrationTests.md)
