# PATCH /todos/:id endpoint 'happy path' integration tests

[Jump to complete test code](#final-updatetodo-happy-path-integration-test-code)

[tests for `task` and `completed` properties](#happy-route-integration-tests-for-both-task-and-completed)

[tests for `task` property only](#happy-route-integration-tests-for-task-only)

[tests for `completed` property only](#happy-route-integration-tests-for-completed-only)

**NOTE:** As the testing for the `PATCH` endpoint is considerably longer than other endpoints, both the unit and integration sections have been split into `happy path` and `error handling` tests.

Within the over-arching `describe('App todo endpoints integration tests')` block, add a `describe` block for the `PATCH /todos/:id` route:

```javascript
describe('PATCH /todos/:id', () => {})
```

## 'Happy route' integration tests for both `task` and `completed`

```javascript
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
```

## 'Happy route' integration tests for `task` only

```javascript
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
```

## 'Happy route' integration tests for `completed` only

```javascript
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
```

[NEXT: PATCH /todos/:id error handling integration tests](6e_updateTodo_errorHandlingIntegrationTests.md)

### Final updateTodo happy path integration test code

```javascript
describe('UPDATE /todos/:id', () => {
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
})
```

[NEXT: PATCH /todos/:id error handling integration tests](6e_updateTodo_errorHandlingIntegrationTests.md)
