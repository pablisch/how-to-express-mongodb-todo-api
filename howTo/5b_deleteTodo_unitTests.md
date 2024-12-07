# Write deleteTodo controller function unit tests

[Jump to complete test code](#final-deletetodo-unit-test-code)

Add the `deleteTodo` function to the existing imports:

```javascript
const {
  getAllTodos,
  getTodoById,
  createTodo,
  deleteTodo,
} = require('./todoController')
```

Within the over-arching `describe('Todo routes controller functions unit tests')` block, add a `describe` block for the `deleteTodo` function:

```javascript
describe('deleteTodo()', () => {})
```

## Add 'happy route' unit tests

```javascript
test.each([
  ['123456789012345678901234', 'Eat', true],
  ['234567890123456789012345', 'Sleep', false],
  ['345678901234567890123456', 'Pray', false],
])(
  'should delete todo with id: "%s" from the database and return status 200 with a success confirmation message',
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
    await deleteTodo(mReq, mRes, mNext)

    // Assert
    expect(mRes.status).toHaveBeenCalledWith(200)
    expect(mRes.json).toHaveBeenCalledWith({
      message: `Todo with ID ${id} was successfully deleted`,
    })

    // Act
    const todo = await Todo.findById(id)

    // Assert
    expect(todo).toBeNull()
  },
)
```

**NOTE:** In this case, since all we get back is a message saying that the `todo` has been deleted, there is an extra `findById` call to look in the database for that `todo`. This check should find no such `todo` and return `null`. This is optional.

## Unit testing validation and error handling

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
  ['cat', 400, `'cat' is not a valid todo ID`],
  [true, 400, `'true' is not a valid todo ID`],
])(
  'should return status 400 and an appropriate error message when passed task: "%s"',
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
    await deleteTodo(mReq, mRes, mNext)

    // Assert
    expect(mRes.status).not.toHaveBeenCalled()
    expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
    expect(mNext.mock.calls[0][0].status).toBe(status)
    expect(mNext.mock.calls[0][0].message).toBe(errorMessage)
  },
)
```

[NEXT: DELETE /todos integration tests](5c_deleteTodo_integrationTests.md)

### Final deleteTodo unit test code

```javascript
describe('deleteTodo()', () => {
  test.each([
    ['123456789012345678901234', 'Eat', true],
    ['234567890123456789012345', 'Sleep', false],
    ['345678901234567890123456', 'Pray', false],
  ])(
    'should delete todo with id: "%s" from the database and return status 200 with a success confirmation message',
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
      await deleteTodo(mReq, mRes, mNext)

      // Assert
      expect(mRes.status).toHaveBeenCalledWith(200)
      expect(mRes.json).toHaveBeenCalledWith({
        message: `Todo with ID ${id} was successfully deleted`,
      })

      // Act
      const todo = await Todo.findById(id)

      // Assert
      expect(todo).toBeNull()
    },
  )

  test.each([
    [
      '999999999999999999999999',
      404,
      'No todo with ID 999999999999999999999999 was found in the database',
    ],
    ['cat', 400, `'cat' is not a valid todo ID`],
    [true, 400, `'true' is not a valid todo ID`],
  ])(
    'should return status 400 and an appropriate error message when passed task: "%s"',
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
      await deleteTodo(mReq, mRes, mNext)

      // Assert
      expect(mRes.status).not.toHaveBeenCalled()
      expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
      expect(mNext.mock.calls[0][0].status).toBe(status)
      expect(mNext.mock.calls[0][0].message).toBe(errorMessage)
    },
  )
})
```

[NEXT: DELETE /todos integration tests](5c_deleteTodo_integrationTests.md)
