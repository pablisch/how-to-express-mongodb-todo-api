# Write updateTodo controller function 'happy path' unit tests

[Jump to complete updateTodo happy path test code](#final-updatetodo-happy-path-unit-test-code)

[tests for `task` and `completed` properties](#happy-route-unit-tests-for-both-task-and-completed)

[tests for `task` property only](#happy-route-unit-tests-for-task-only)

[tests for `completed` property only](#happy-route-unit-tests-for-completed-only)

**NOTE:** As the testing for the `PATCH` endpoint is considerably longer than other endpoints, both the unit and integration sections have been split into `happy path` and `error handling` tests.

Add the `updateTodo` function to the existing imports:

```javascript
const {
  getAllTodos,
  getTodoById,
  createTodo,
  deleteTodo,
  updateTodo,
} = require('./todoController')
```

Within the over-arching `describe('Todo routes controller functions unit tests')` block, add a `describe` block for the `updateTodo` function:

```javascript
describe('updateTodo()', () => {})
```

## 'Happy route' unit tests for both `task` and `completed`

```javascript
test.each([
  ['123456789012345678901234', 'Jump', false],
  ['234567890123456789012345', 'Dream', true],
  ['345678901234567890123456', 'Swim', true],
])(
  'should update todo with ID: "%s" in the database and return status 200 and the updated todo object when passed ALL properties, task: "%s" and completed: %s',
  async (id, task, completed) => {
    // Arrange
    const mReq = {
      params: {
        id,
      },
      body: {
        task,
        completed,
      },
    }
    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const mNext = jest.fn()

    // Act
    await updateTodo(mReq, mRes, mNext)

    // Assert
    expect(mRes.status).toHaveBeenCalledWith(200)
    const updatedTodo = mRes.json.mock.calls[0][0]
    expect(updatedTodo._id.toString()).toBe(id)
    expect(updatedTodo.task).toBe(task)
    expect(updatedTodo.completed).toBe(completed)
  },
)
```

## 'Happy route' unit tests for `task` only

```javascript
test.each([
  ['123456789012345678901234', 'Jump'],
  ['234567890123456789012345', 'Dream'],
  ['345678901234567890123456', 'Swim'],
])(
  'should update todo with ID: "%s" in the database and return status 200 and the updated todo object when passed ONLY task: "%s"',
  async (id, task) => {
    // Arrange
    const mReq = {
      params: {
        id,
      },
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
    await updateTodo(mReq, mRes, mNext)

    // Assert
    expect(mRes.status).toHaveBeenCalledWith(200)
    const updatedTodo = mRes.json.mock.calls[0][0]
    expect(updatedTodo._id.toString()).toBe(id)
    expect(updatedTodo.task).toBe(task)
    expect(updatedTodo.completed).not.toBe(undefined)
  },
)
```

**NOTE:** Initially, I still passed in the current `completed` values to assert that they had not changed. At some point I decided to only pass in the `task` and assert that the `completed` value was not undefined. In some ways, the original test is more thorough but it does make the test bound to the test data which seems unnecessary.

## 'Happy route' unit tests for `completed` only

```javascript
test.each([
  ['123456789012345678901234', false],
  ['234567890123456789012345', true],
  ['345678901234567890123456', true],
])(
  'should update todo with ID: "%s" in the database and return status 200 and the updated todo object when passed ONLY completed: %s',
  async (id, completed) => {
    // Arrange
    const mReq = {
      params: {
        id,
      },
      body: {
        completed,
      },
    }
    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const mNext = jest.fn()

    // Act
    await updateTodo(mReq, mRes, mNext)

    // Assert
    expect(mRes.status).toHaveBeenCalledWith(200)
    const updatedTodo = mRes.json.mock.calls[0][0]
    expect(updatedTodo._id.toString()).toBe(id)
    expect(updatedTodo.task).not.toBe(undefined)
    expect(updatedTodo.completed).toBe(completed)
  },
)
```

[NEXT: Add updateTodo controller error handling unit tests](6c_updateTodo_errorHandlingUnitTests.md)

### Final updateTodo happy path unit test code

```javascript
describe('updateTodo()', () => {
  test.each([
    ['123456789012345678901234', 'Jump', false],
    ['234567890123456789012345', 'Dream', true],
    ['345678901234567890123456', 'Swim', true],
  ])(
    'should update todo with ID: "%s" in the database and return status 200 and the updated todo object when passed ALL properties, task: "%s" and completed: %s',
    async (id, task, completed) => {
      // Arrange
      const mReq = {
        params: {
          id,
        },
        body: {
          task,
          completed,
        },
      }
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mNext = jest.fn()

      // Act
      await updateTodo(mReq, mRes, mNext)

      // Assert
      expect(mRes.status).toHaveBeenCalledWith(200)
      const updatedTodo = mRes.json.mock.calls[0][0]
      expect(updatedTodo._id.toString()).toBe(id)
      expect(updatedTodo.task).toBe(task)
      expect(updatedTodo.completed).toBe(completed)
    },
  )

  test.each([
    ['123456789012345678901234', 'Jump'],
    ['234567890123456789012345', 'Dream'],
    ['345678901234567890123456', 'Swim'],
  ])(
    'should update todo with ID: "%s" in the database and return status 200 and the updated todo object when passed ONLY task: "%s"',
    async (id, task) => {
      // Arrange
      const mReq = {
        params: {
          id,
        },
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
      await updateTodo(mReq, mRes, mNext)

      // Assert
      expect(mRes.status).toHaveBeenCalledWith(200)
      const updatedTodo = mRes.json.mock.calls[0][0]
      expect(updatedTodo._id.toString()).toBe(id)
      expect(updatedTodo.task).toBe(task)
      expect(updatedTodo.completed).not.toBe(undefined)
    },
  )

  test.each([
    ['123456789012345678901234', false],
    ['234567890123456789012345', true],
    ['345678901234567890123456', true],
  ])(
    'should update todo with ID: "%s" in the database and return status 200 and the updated todo object when passed ONLY completed: %s',
    async (id, completed) => {
      // Arrange
      const mReq = {
        params: {
          id,
        },
        body: {
          completed,
        },
      }
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mNext = jest.fn()

      // Act
      await updateTodo(mReq, mRes, mNext)

      // Assert
      expect(mRes.status).toHaveBeenCalledWith(200)
      const updatedTodo = mRes.json.mock.calls[0][0]
      expect(updatedTodo._id.toString()).toBe(id)
      expect(updatedTodo.task).not.toBe(undefined)
      expect(updatedTodo.completed).toBe(completed)
    },
  )
})
```

[NEXT: PATCH /todos integration tests](6c_updateTodo_errorHandlingUnitTests.md)
