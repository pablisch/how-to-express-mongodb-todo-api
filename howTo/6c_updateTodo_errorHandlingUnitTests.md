# Write updateTodo controller function 'happy path' unit tests

[Jump to completed error handling unit test code for `updateTodo`](#final-updatetodo-error-handling-unit-test-code)

[Jump to completed unit test code for ALL `updateTodo`](#final-updatetodo-complete-unit-test-code)

[tests for `task` and `completed` properties](#validation-and-error-handling-tests-for-both-task-and-completed)

[tests for valid `req.body` object](#validation-and-error-handling-tests-for-reqbody-object)

[tests for `task` property only](#validation-and-error-handling-tests-for-task-only)

[tests for `completed` property only](#validation-and-error-handling-tests-for-completed-only)

This is part two of the `updateTodo` controller unit tests.

## Validation and error handling tests for both `task` and `completed`

Test validation and error handling for:

- the `_id` not being a valid MongoDB ID object
- `task` with `_id` not found in the database
- `task` should not be an empty string
- `task` should be of string type
- `completed` should be of Boolean type
- `task` and/or `completed` must be passed in

**NOTE:** this test cannot validate that the `req.body` is a valid JS object as the test passes in a JS object as body. A separate test is need for this.

Within the over-arching `describe('updateTodo()')` block, add the unit tests for when both `task` and `completed` properties are passed in:

```javascript
test.each([
  [
    '123456789012345678901234',
    '',
    false,
    400,
    'Task cannot be an empty string. If a task property is sent, it must be a valid string',
  ],
  [
    '234567890123456789012345',
    true,
    true,
    400,
    'Task property must be a string. Received type boolean',
  ],
  [
    '345678901234567890123456',
    400,
    true,
    400,
    'Task property must be a string. Received type number',
  ],
  [
    '123456789012345678901234',
    ['Hello world'],
    true,
    400,
    'Task property must be a string. Received type object',
  ],
  [
    '234567890123456789012345',
    'Dream',
    'true',
    400,
    'Completed property must be a Boolean. Received type string',
  ],
  [
    '345678901234567890123456',
    'Dream',
    400,
    400,
    'Completed property must be a Boolean. Received type number',
  ],
  [
    '123456789012345678901234',
    'Dream',
    [true],
    400,
    'Completed property must be a Boolean. Received type object',
  ],
  ['cat', 'Fly', true, 400, "'cat' is not a valid todo ID"],
  [
    '999999999999999999999999',
    'Fly',
    true,
    404,
    'No todo with ID 999999999999999999999999 was found in the database',
  ],
  [
    '123456789012345678901234',
    undefined,
    undefined,
    400,
    'Updating a todo requires a task and/or completed property',
  ],
])(
  'should return an appropriate status and error message for todo with id: "%s", task: "%s" and completed: %s',
  async (id, task, completed, status, errorMessage) => {
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
    expect(mRes.status).not.toHaveBeenCalled()
    expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
    expect(mNext.mock.calls[0][0]).toEqual({ status, message: errorMessage })
    expect(mNext.mock.calls[0][0].status).toBe(status)
    expect(mNext.mock.calls[0][0].message).toBe(errorMessage)
  },
)
```

## Validation and error handling tests for req.body object

Test validation and error handling for:

- `req.body` is a JS object

```javascript
test.each([
  [
    '123456789012345678901234',
    ['Dream', true],
    400,
    'The request body must be a valid JS object',
  ],
  [
    '234567890123456789012345',
    'Dream',
    400,
    'The request body must be a valid JS object',
  ],
  [
    '345678901234567890123456',
    true,
    400,
    'The request body must be a valid JS object',
  ],
])(
  'should return an appropriate status and error message for todo with id: "%s" when passed req.body: %s',
  async (id, body, status, errorMessage) => {
    // Arrange
    const mReq = {
      params: {
        id,
      },
      body: body,
    }
    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const mNext = jest.fn()

    // Act
    await updateTodo(mReq, mRes, mNext)

    // Assert
    expect(mRes.status).not.toHaveBeenCalled()
    expect(mNext.mock.calls[0][0]).toEqual({ status, message: errorMessage })
  },
)
```

## Validation and error handling tests for `task` only

Test validation and error handling for:

- `task` should not be an empty string
- `task` should be of string type

```javascript
test.each([
  [
    '123456789012345678901234',
    '',
    400,
    'Task cannot be an empty string. If a task property is sent, it must be a valid string',
  ],
  [
    '234567890123456789012345',
    true,
    400,
    'Task property must be a string. Received type boolean',
  ],
  [
    '345678901234567890123456',
    400,
    400,
    'Task property must be a string. Received type number',
  ],
  [
    '123456789012345678901234',
    ['Hello world'],
    400,
    'Task property must be a string. Received type object',
  ],
])(
  'should return an appropriate status and error message for todo with id: "%s" when passed ONLY task: "%s"',
  async (id, task, status, errorMessage) => {
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
    expect(mRes.status).not.toHaveBeenCalled()
    expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
    expect(mNext.mock.calls[0][0]).toEqual({ status, message: errorMessage })
  },
)
```

## Validation and error handling tests for `completed` only

Test validation and error handling for:

- `completed` should be of Boolean type

```javascript
test.each([
  [
    '234567890123456789012345',
    'true',
    400,
    'Completed property must be a Boolean. Received type string',
  ],
  [
    '345678901234567890123456',
    400,
    400,
    'Completed property must be a Boolean. Received type number',
  ],
  [
    '123456789012345678901234',
    [true],
    400,
    'Completed property must be a Boolean. Received type object',
  ],
])(
  'should return an appropriate status and error message for todo with id: "%s" when passed ONLY completed: %s',
  async (id, completed, status, errorMessage) => {
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
    expect(mRes.status).not.toHaveBeenCalled()
    expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
    expect(mNext.mock.calls[0][0]).toEqual({ status, message: errorMessage })
  },
)
```

[NEXT: PATCH /todos happy path integration tests](6d_updateTodo_happyPathIntegrationTests.md)

### Final updateTodo error handling unit test code

```javascript
test.each([
  [
    '123456789012345678901234',
    '',
    false,
    400,
    'Task cannot be an empty string. If a task property is sent, it must be a valid string',
  ],
  [
    '234567890123456789012345',
    true,
    true,
    400,
    'Task property must be a string. Received type boolean',
  ],
  [
    '345678901234567890123456',
    400,
    true,
    400,
    'Task property must be a string. Received type number',
  ],
  [
    '123456789012345678901234',
    ['Hello world'],
    true,
    400,
    'Task property must be a string. Received type object',
  ],
  [
    '234567890123456789012345',
    'Dream',
    'true',
    400,
    'Completed property must be a Boolean. Received type string',
  ],
  [
    '345678901234567890123456',
    'Dream',
    400,
    400,
    'Completed property must be a Boolean. Received type number',
  ],
  [
    '123456789012345678901234',
    'Dream',
    [true],
    400,
    'Completed property must be a Boolean. Received type object',
  ],
  ['cat', 'Fly', true, 400, "'cat' is not a valid todo ID"],
  [
    '999999999999999999999999',
    'Fly',
    true,
    404,
    'No todo with ID 999999999999999999999999 was found in the database',
  ],
  [
    '123456789012345678901234',
    undefined,
    undefined,
    400,
    'Updating a todo requires a task and/or completed property',
  ],
])(
  'should return an appropriate status and error message for todo with id: "%s", task: "%s" and completed: %s',
  async (id, task, completed, status, errorMessage) => {
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
    expect(mRes.status).not.toHaveBeenCalled()
    expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
    expect(mNext.mock.calls[0][0]).toEqual({ status, message: errorMessage })
    expect(mNext.mock.calls[0][0].status).toBe(status)
    expect(mNext.mock.calls[0][0].message).toBe(errorMessage)
  },
)

test.each([
  [
    '123456789012345678901234',
    ['Dream', true],
    400,
    'The request body must be a valid JS object',
  ],
  [
    '234567890123456789012345',
    'Dream',
    400,
    'The request body must be a valid JS object',
  ],
  [
    '345678901234567890123456',
    true,
    400,
    'The request body must be a valid JS object',
  ],
])(
  'should return an appropriate status and error message for todo with id: "%s" when passed req.body: %s',
  async (id, body, status, errorMessage) => {
    // Arrange
    const mReq = {
      params: {
        id,
      },
      body: body,
    }
    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const mNext = jest.fn()

    // Act
    await updateTodo(mReq, mRes, mNext)

    // Assert
    expect(mRes.status).not.toHaveBeenCalled()
    expect(mNext.mock.calls[0][0]).toEqual({ status, message: errorMessage })
  },
)

test.each([
  [
    '123456789012345678901234',
    '',
    400,
    'Task cannot be an empty string. If a task property is sent, it must be a valid string',
  ],
  [
    '234567890123456789012345',
    true,
    400,
    'Task property must be a string. Received type boolean',
  ],
  [
    '345678901234567890123456',
    400,
    400,
    'Task property must be a string. Received type number',
  ],
  [
    '123456789012345678901234',
    ['Hello world'],
    400,
    'Task property must be a string. Received type object',
  ],
])(
  'should return an appropriate status and error message for todo with id: "%s" when passed ONLY task: "%s"',
  async (id, task, status, errorMessage) => {
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
    expect(mRes.status).not.toHaveBeenCalled()
    expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
    expect(mNext.mock.calls[0][0]).toEqual({ status, message: errorMessage })
  },
)

test.each([
  [
    '234567890123456789012345',
    'true',
    400,
    'Completed property must be a Boolean. Received type string',
  ],
  [
    '345678901234567890123456',
    400,
    400,
    'Completed property must be a Boolean. Received type number',
  ],
  [
    '123456789012345678901234',
    [true],
    400,
    'Completed property must be a Boolean. Received type object',
  ],
])(
  'should return an appropriate status and error message for todo with id: "%s" when passed ONLY completed: %s',
  async (id, completed, status, errorMessage) => {
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
    expect(mRes.status).not.toHaveBeenCalled()
    expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
    expect(mNext.mock.calls[0][0]).toEqual({ status, message: errorMessage })
  },
)
```

[NEXT: PATCH /todos happy path integration tests](6d_updateTodo_happyPathIntegrationTests.md)

### Final updateTodo COMPLETE unit test code

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

  test.each([
    [
      '123456789012345678901234',
      '',
      false,
      400,
      'Task cannot be an empty string. If a task property is sent, it must be a valid string',
    ],
    [
      '234567890123456789012345',
      true,
      true,
      400,
      'Task property must be a string. Received type boolean',
    ],
    [
      '345678901234567890123456',
      400,
      true,
      400,
      'Task property must be a string. Received type number',
    ],
    [
      '123456789012345678901234',
      ['Hello world'],
      true,
      400,
      'Task property must be a string. Received type object',
    ],
    [
      '234567890123456789012345',
      'Dream',
      'true',
      400,
      'Completed property must be a Boolean. Received type string',
    ],
    [
      '345678901234567890123456',
      'Dream',
      400,
      400,
      'Completed property must be a Boolean. Received type number',
    ],
    [
      '123456789012345678901234',
      'Dream',
      [true],
      400,
      'Completed property must be a Boolean. Received type object',
    ],
    ['cat', 'Fly', true, 400, "'cat' is not a valid todo ID"],
    [
      '999999999999999999999999',
      'Fly',
      true,
      404,
      'No todo with ID 999999999999999999999999 was found in the database',
    ],
    [
      '123456789012345678901234',
      undefined,
      undefined,
      400,
      'Updating a todo requires a task and/or completed property',
    ],
  ])(
    'should return an appropriate status and error message for todo with id: "%s", task: "%s" and completed: %s',
    async (id, task, completed, status, errorMessage) => {
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
      expect(mRes.status).not.toHaveBeenCalled()
      expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
      expect(mNext.mock.calls[0][0]).toEqual({ status, message: errorMessage })
      expect(mNext.mock.calls[0][0].status).toBe(status)
      expect(mNext.mock.calls[0][0].message).toBe(errorMessage)
    },
  )

  test.each([
    [
      '123456789012345678901234',
      ['Dream', true],
      400,
      'The request body must be a valid JS object',
    ],
    [
      '234567890123456789012345',
      'Dream',
      400,
      'The request body must be a valid JS object',
    ],
    [
      '345678901234567890123456',
      true,
      400,
      'The request body must be a valid JS object',
    ],
  ])(
    'should return an appropriate status and error message for todo with id: "%s" when passed req.body: %s',
    async (id, body, status, errorMessage) => {
      // Arrange
      const mReq = {
        params: {
          id,
        },
        body: body,
      }
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mNext = jest.fn()

      // Act
      await updateTodo(mReq, mRes, mNext)

      // Assert
      expect(mRes.status).not.toHaveBeenCalled()
      expect(mNext.mock.calls[0][0]).toEqual({ status, message: errorMessage })
    },
  )

  test.each([
    [
      '123456789012345678901234',
      '',
      400,
      'Task cannot be an empty string. If a task property is sent, it must be a valid string',
    ],
    [
      '234567890123456789012345',
      true,
      400,
      'Task property must be a string. Received type boolean',
    ],
    [
      '345678901234567890123456',
      400,
      400,
      'Task property must be a string. Received type number',
    ],
    [
      '123456789012345678901234',
      ['Hello world'],
      400,
      'Task property must be a string. Received type object',
    ],
  ])(
    'should return an appropriate status and error message for todo with id: "%s" when passed ONLY task: "%s"',
    async (id, task, status, errorMessage) => {
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
      expect(mRes.status).not.toHaveBeenCalled()
      expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
      expect(mNext.mock.calls[0][0]).toEqual({ status, message: errorMessage })
    },
  )

  test.each([
    [
      '234567890123456789012345',
      'true',
      400,
      'Completed property must be a Boolean. Received type string',
    ],
    [
      '345678901234567890123456',
      400,
      400,
      'Completed property must be a Boolean. Received type number',
    ],
    [
      '123456789012345678901234',
      [true],
      400,
      'Completed property must be a Boolean. Received type object',
    ],
  ])(
    'should return an appropriate status and error message for todo with id: "%s" when passed ONLY completed: %s',
    async (id, completed, status, errorMessage) => {
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
      expect(mRes.status).not.toHaveBeenCalled()
      expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
      expect(mNext.mock.calls[0][0]).toEqual({ status, message: errorMessage })
    },
  )
})
```

[NEXT: PATCH /todos happy path integration tests](6d_updateTodo_happyPathIntegrationTests.md)
