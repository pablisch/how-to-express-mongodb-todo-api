# PATCH /todos/:id endpoint error handling integration tests

[Jump to completed error handling test code for `PATCH /todos/:id`](#final-patch-todosid-error-handling-integration-test-code)

[Jump to completed test code for ALL `PATCH /todos/:id`](#final-patch-todosid-complete-integration-test-code)

[tests for `task` and `completed` properties](#validation-and-error-handling-integration-tests-for-both-task-and-completed)

[tests for valid `req.body` object](#validation-and-error-handling-integration-tests-for-reqbody-object)

[tests for `task` property only](#validation-and-error-handling-integration-tests-for-task-only)

[tests for `completed` property only](#validation-and-error-handling-integration-tests-for-completed-only)

Within `describe('PATCH /todos/:id')` block, below the `happy path` tests:

## Validation and error handling integration tests for both `task` and `completed`

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
    'Dream',
    ['Hello world'],
    400,
    'Completed property must be a Boolean. Received type object',
  ],
  [
    '345678901234567890123456',
    'Dream',
    'fish',
    400,
    'Completed property must be a Boolean. Received type string',
  ],
  [
    '123456789012345678901234',
    'Dream',
    212,
    400,
    'Completed property must be a Boolean. Received type number',
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
    212,
    true,
    400,
    'Task property must be a string. Received type number',
  ],
  [
    '999999999999999999999999',
    'Fly',
    'pig',
    400,
    'Completed property must be a Boolean. Received type string',
  ],
  ['cat', 'Fly', true, 400, "'cat' is not a valid todo ID"],
  [
    '999999999999999999999999',
    'Fly',
    true,
    404,
    'No todo with ID 999999999999999999999999 was found in the database',
  ],
])(
  'should return an appropriate status and error message when passed the ID param: "%s", task property: "%s" and completed property: %s',
  async (id, task, completed, status, errorMessage) => {
    // Act
    const response = await request(app)
      .patch(`/todos/${id}`)
      .send({ task, completed })

    // Assert
    expect(response.status).toBe(status)
    expect(response.body.message).toBe(errorMessage)
    expect(response.body).toEqual({ message: errorMessage })
  },
)
```

## Validation and error handling integration tests for `req.body` object

```javascript
test.each([
  [
    '123456789012345678901234',
    ['Dream', false],
    400,
    'The request body must be a valid JS object',
  ],
  [
    '234567890123456789012345',
    [],
    400,
    'The request body must be a valid JS object',
  ],
  [
    '345678901234567890123456',
    [{ task: 'Dream', completed: true }],
    400,
    'The request body must be a valid JS object',
  ],
])(
  'should return an appropriate status and error message when passed the ID param: "%s", and an invalid req.body: %s',
  async (id, body, status, errorMessage) => {
    // Act
    const response = await request(app)
      .patch(`/todos/${id}`)
      .send(body)
      .set('Content-Type', 'application/json')

    // Assert
    expect(response.status).toBe(status)
    expect(response.body.message).toBe(errorMessage)
    expect(response.body).toEqual({ message: errorMessage })
  },
)
```

**NOTE:** Due to the way that Express parses the body, any tests written for a valid `req.body` that pass in non-object, e.g. a string, fail to validate as expected. The test still fails but not in the expected way. If `headers` are set with the `Content-type` set to `application/json` then Express will handle these errors before they reach the `todoController`.

## Validation and error handling integration tests for `task` only

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
    212,
    400,
    'Task property must be a string. Received type number',
  ],
])(
  'should return an appropriate status and error message when passed the ID param: "%s" and ONLY task property: "%s"',
  async (id, task, status, errorMessage) => {
    // Act
    const response = await request(app).patch(`/todos/${id}`).send({ task })

    // Assert
    expect(response.status).toBe(status)
    expect(response.body.message).toBe(errorMessage)
    expect(response.body).toEqual({ message: errorMessage })
  },
)
```

## Validation and error handling integration tests for `completed` only

```javascript
test.each([
  [
    '123456789012345678901234',
    212,
    400,
    'Completed property must be a Boolean. Received type number',
  ],
  [
    '234567890123456789012345',
    ['Hello world'],
    400,
    'Completed property must be a Boolean. Received type object',
  ],
  [
    '345678901234567890123456',
    'fish',
    400,
    'Completed property must be a Boolean. Received type string',
  ],
  [
    '999999999999999999999999',
    'pig',
    400,
    'Completed property must be a Boolean. Received type string',
  ],
])(
  'should return an appropriate status and error message when passed the ID param: "%s" and ONLY completed property: %s',
  async (id, completed, status, errorMessage) => {
    // Act
    const response = await request(app)
      .patch(`/todos/${id}`)
      .send({ completed })

    // Assert
    expect(response.status).toBe(status)
    expect(response.body.message).toBe(errorMessage)
    expect(response.body).toEqual({ message: errorMessage })
  },
)
```

[NEXT: Notes on testing in this repository](7a_misc_notesOnTestingInRepo.md)

### Final `PATCH /todos/:id` error handling integration test code

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
    'Dream',
    ['Hello world'],
    400,
    'Completed property must be a Boolean. Received type object',
  ],
  [
    '345678901234567890123456',
    'Dream',
    'fish',
    400,
    'Completed property must be a Boolean. Received type string',
  ],
  [
    '123456789012345678901234',
    'Dream',
    212,
    400,
    'Completed property must be a Boolean. Received type number',
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
    212,
    true,
    400,
    'Task property must be a string. Received type number',
  ],
  [
    '999999999999999999999999',
    'Fly',
    'pig',
    400,
    'Completed property must be a Boolean. Received type string',
  ],
  ['cat', 'Fly', true, 400, "'cat' is not a valid todo ID"],
  [
    '999999999999999999999999',
    'Fly',
    true,
    404,
    'No todo with ID 999999999999999999999999 was found in the database',
  ],
])(
  'should return an appropriate status and error message when passed the ID param: "%s", task property: "%s" and completed property: %s',
  async (id, task, completed, status, errorMessage) => {
    // Act
    const response = await request(app)
      .patch(`/todos/${id}`)
      .send({ task, completed })

    // Assert
    expect(response.status).toBe(status)
    expect(response.body.message).toBe(errorMessage)
    expect(response.body).toEqual({ message: errorMessage })
  },
)

test.each([
  [
    '123456789012345678901234',
    ['Dream', false],
    400,
    'The request body must be a valid JS object',
  ],
  [
    '234567890123456789012345',
    [],
    400,
    'The request body must be a valid JS object',
  ],
  [
    '345678901234567890123456',
    [{ task: 'Dream', completed: true }],
    400,
    'The request body must be a valid JS object',
  ],
])(
  'should return an appropriate status and error message when passed the ID param: "%s", and an invalid req.body: %s',
  async (id, body, status, errorMessage) => {
    // Act
    const response = await request(app)
      .patch(`/todos/${id}`)
      .send(body)
      .set('Content-Type', 'application/json')

    // Assert
    expect(response.status).toBe(status)
    expect(response.body.message).toBe(errorMessage)
    expect(response.body).toEqual({ message: errorMessage })
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
    212,
    400,
    'Task property must be a string. Received type number',
  ],
])(
  'should return an appropriate status and error message when passed the ID param: "%s" and ONLY task property: "%s"',
  async (id, task, status, errorMessage) => {
    // Act
    const response = await request(app).patch(`/todos/${id}`).send({ task })

    // Assert
    expect(response.status).toBe(status)
    expect(response.body.message).toBe(errorMessage)
    expect(response.body).toEqual({ message: errorMessage })
  },
)

test.each([
  [
    '123456789012345678901234',
    212,
    400,
    'Completed property must be a Boolean. Received type number',
  ],
  [
    '234567890123456789012345',
    ['Hello world'],
    400,
    'Completed property must be a Boolean. Received type object',
  ],
  [
    '345678901234567890123456',
    'fish',
    400,
    'Completed property must be a Boolean. Received type string',
  ],
  [
    '999999999999999999999999',
    'pig',
    400,
    'Completed property must be a Boolean. Received type string',
  ],
])(
  'should return an appropriate status and error message when passed the ID param: "%s" and ONLY completed property: %s',
  async (id, completed, status, errorMessage) => {
    // Act
    const response = await request(app)
      .patch(`/todos/${id}`)
      .send({ completed })

    // Assert
    expect(response.status).toBe(status)
    expect(response.body.message).toBe(errorMessage)
    expect(response.body).toEqual({ message: errorMessage })
  },
)
```

[NEXT: Notes on testing in this repository](7a_misc_notesOnTestingInRepo.md)

### Final `PATCH /todos/:id` COMPLETE integration test code

```javascript
describe('PATCH /todos/:id', () => {
  test.each([
    ['123456789012345678901234', 'Eat', false],
    ['234567890123456789012345', 'Dream', true],
    ['345678901234567890123456', 'Pray', true],
    ['123456789012345678901234', 'Swim', false],
    ['234567890123456789012345', 'Dream', false],
  ])(
    `should update todo in the database and return status 200 and an array with the updated todo object when passed id: "%s", task: "%s" and completed: %s`,
    async (id, task, completed) => {
      // Act
      const response = await request(app)
        .patch(`/todos/${id}`)
        .send({ task, completed })

      // Assert
      expect(response.status).toBe(200)
      const updatedTodo = response.body
      expect(updatedTodo).toMatchObject({ _id: id, task, completed })
      expect(updatedTodo._id.toString()).toBe(id)
      expect(updatedTodo.task).toBe(task)
      expect(updatedTodo.completed).toBe(completed)
    },
  )

  test.each([
    ['123456789012345678901234', 'Go on holiday'],
    ['234567890123456789012345', 'Dream'],
    ['345678901234567890123456', 'Surf'],
  ])(
    'should update todo in the database and return status 200 and an array with the updated todo object with id: "%s" when only the task property: "%s", is passed in',
    async (id, task) => {
      // Act
      const response = await request(app).patch(`/todos/${id}`).send({ task })

      // Assert
      expect(response.status).toBe(200)
      const updatedTodo = response.body
      expect(updatedTodo).toMatchObject({ _id: id, task })
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
    'should update todo in the database and return status 200 and an array with the updated todo object with id: "%s" when only the completed property: %s, is passed in',
    async (id, completed) => {
      // Act
      const response = await request(app)
        .patch(`/todos/${id}`)
        .send({ completed })

      // Assert
      expect(response.status).toBe(200)
      const updatedTodo = response.body
      expect(updatedTodo).toMatchObject({ _id: id, completed })
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
      'Dream',
      ['Hello world'],
      400,
      'Completed property must be a Boolean. Received type object',
    ],
    [
      '345678901234567890123456',
      'Dream',
      'fish',
      400,
      'Completed property must be a Boolean. Received type string',
    ],
    [
      '123456789012345678901234',
      'Dream',
      212,
      400,
      'Completed property must be a Boolean. Received type number',
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
      212,
      true,
      400,
      'Task property must be a string. Received type number',
    ],
    [
      '999999999999999999999999',
      'Fly',
      'pig',
      400,
      'Completed property must be a Boolean. Received type string',
    ],
    ['cat', 'Fly', true, 400, "'cat' is not a valid todo ID"],
    [
      '999999999999999999999999',
      'Fly',
      true,
      404,
      'No todo with ID 999999999999999999999999 was found in the database',
    ],
  ])(
    'should return an appropriate status and error message when passed the ID param: "%s", task property: "%s" and completed property: %s',
    async (id, task, completed, status, errorMessage) => {
      // Act
      const response = await request(app)
        .patch(`/todos/${id}`)
        .send({ task, completed })

      // Assert
      expect(response.status).toBe(status)
      expect(response.body.message).toBe(errorMessage)
      expect(response.body).toEqual({ message: errorMessage })
    },
  )

  test.each([
    [
      '123456789012345678901234',
      ['Dream', false],
      400,
      'The request body must be a valid JS object',
    ],
    [
      '234567890123456789012345',
      [],
      400,
      'The request body must be a valid JS object',
    ],
    [
      '345678901234567890123456',
      [{ task: 'Dream', completed: true }],
      400,
      'The request body must be a valid JS object',
    ],
  ])(
    'should return an appropriate status and error message when passed the ID param: "%s", and an invalid req.body: %s',
    async (id, body, status, errorMessage) => {
      // Act
      const response = await request(app)
        .patch(`/todos/${id}`)
        .send(body)
        .set('Content-Type', 'application/json')

      // Assert
      expect(response.status).toBe(status)
      expect(response.body.message).toBe(errorMessage)
      expect(response.body).toEqual({ message: errorMessage })
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
      212,
      400,
      'Task property must be a string. Received type number',
    ],
  ])(
    'should return an appropriate status and error message when passed the ID param: "%s" and ONLY task property: "%s"',
    async (id, task, status, errorMessage) => {
      // Act
      const response = await request(app).patch(`/todos/${id}`).send({ task })

      // Assert
      expect(response.status).toBe(status)
      expect(response.body.message).toBe(errorMessage)
      expect(response.body).toEqual({ message: errorMessage })
    },
  )

  test.each([
    [
      '123456789012345678901234',
      212,
      400,
      'Completed property must be a Boolean. Received type number',
    ],
    [
      '234567890123456789012345',
      ['Hello world'],
      400,
      'Completed property must be a Boolean. Received type object',
    ],
    [
      '345678901234567890123456',
      'fish',
      400,
      'Completed property must be a Boolean. Received type string',
    ],
    [
      '999999999999999999999999',
      'pig',
      400,
      'Completed property must be a Boolean. Received type string',
    ],
  ])(
    'should return an appropriate status and error message when passed the ID param: "%s" and ONLY completed property: %s',
    async (id, completed, status, errorMessage) => {
      // Act
      const response = await request(app)
        .patch(`/todos/${id}`)
        .send({ completed })

      // Assert
      expect(response.status).toBe(status)
      expect(response.body.message).toBe(errorMessage)
      expect(response.body).toEqual({ message: errorMessage })
    },
  )
})
```

[NEXT: Notes on testing in this repository](7a_misc_notesOnTestingInRepo.md)
