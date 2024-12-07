# getTodoById controller function unit tests

[Jump to complete test code](#final-gettodobyid-unit-test-code)

Add the `getTodoById` function to the existing imports:

```javascript
const { getAllTodos, getTodoById } = require('./todoController')
```

## Happy route tests

Within the over-arching `describe('Todo routes controller functions unit tests')` block, add a `describe` block for the `getTodoById` function:

```javascript
describe('getTodoById()', () => {})
```

## Add 'happy route' unit tests

```javascript
test.each([
  ['123456789012345678901234', 'Eat', true],
  ['234567890123456789012345', 'Sleep', false],
  ['345678901234567890123456', 'Pray', false],
])(
  'should return a single todo object and status 200 when called with the id param : "%s"',
  async (id, task, completed) => {
    // Arrange
    const mReq = {
      params: {
        id,
      },
    }
    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const mNext = jest.fn()

    // Act
    await getTodoById(mReq, mRes, mNext)

    // Assert
    expect(mRes.status).toBeCalledWith(200)
    const todo = mRes.json.mock.calls[0][0]
    expect(todo._id.toString()).toBe(id)
    expect(todo.task).toBe(task)
    expect(todo.completed).toBe(completed)
    expect(todo.createdAt).toBeInstanceOf(Date)
    expect(todo.updatedAt).toBeInstanceOf(Date)
    expect(todo.__v).toBe(0)
  },
)
```

**NOTES:**

- the `_id` property needs to be made into a string to be compared to our expected string
- we assert that the `createdAt` and `updatedAt` properties are instances of date but there is no need to do more than this or to keep asserting this for every test

## Unit testing validation and error handling

We also test our validation by running function calls that should fail and asserting the message that we receive and the code that is returned.

Test validation and error handling for:

- the `_id` not being a valid MongoDB ID object
- `task` with `_id` not found in the database

```javascript
test.each([
  [
    '999999999999999999999999',
    404,
    'No todo with ID 999999999999999999999999 was found in the database',
  ],
  ['dog', 400, `'dog' is not a valid todo ID`],
  [true, 400, `'true' is not a valid todo ID`],
])(
  'should return an appropriate status and error message when called with id: "%s"',
  async (id, status, errorMessage) => {
    // Arrange
    const mReq = {
      params: {
        id,
      },
    }
    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const mNext = jest.fn()

    // Act
    await getTodoById(mReq, mRes, mNext)

    // Assert
    expect(mRes.status).not.toHaveBeenCalled()
    expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
    const todoCall = mNext.mock.calls[0][0]
    expect(todoCall.status).toBe(status)
    expect(todoCall.message).toBe(errorMessage)
  },
)
```

[NEXT: GET /todos/:id endpoint integration tests](3c_getTodoById_integrationTests.md)

### Final getTodoById unit test code

```javascript
describe('getTodoById()', () => {
  test.each([
    ['123456789012345678901234', 'Eat', true],
    ['234567890123456789012345', 'Sleep', false],
    ['345678901234567890123456', 'Pray', false],
  ])(
    'should return a single todo object and status 200 when called with the id param : "%s"',
    async (id, task, completed) => {
      // Arrange
      const mReq = {
        params: {
          id,
        },
      }
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mNext = jest.fn()

      // Act
      await getTodoById(mReq, mRes, mNext)

      // Assert
      expect(mRes.status).toBeCalledWith(200)
      const todo = mRes.json.mock.calls[0][0]
      expect(todo._id.toString()).toBe(id)
      expect(todo.task).toBe(task)
      expect(todo.completed).toBe(completed)
      expect(todo.createdAt).toBeInstanceOf(Date)
      expect(todo.updatedAt).toBeInstanceOf(Date)
      expect(todo.__v).toBe(0)
    },
  )

  test.each([
    [
      '999999999999999999999999',
      404,
      'No todo with ID 999999999999999999999999 was found in the database',
    ],
    ['dog', 400, `'dog' is not a valid todo ID`],
    [true, 400, `'true' is not a valid todo ID`],
  ])(
    'should return an appropriate status and error message when called with id: "%s"',
    async (id, status, errorMessage) => {
      // Arrange
      const mReq = {
        params: {
          id,
        },
      }
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mNext = jest.fn()

      // Act
      await getTodoById(mReq, mRes, mNext)

      // Assert
      expect(mRes.status).not.toHaveBeenCalled()
      expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
      const todoCall = mNext.mock.calls[0][0]
      expect(todoCall.status).toBe(status)
      expect(todoCall.message).toBe(errorMessage)
    },
  )
})
```

[NEXT: GET /todos/:id endpoint integration tests](3c_getTodoById_integrationTests.md)
