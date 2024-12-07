# POST /todos endpoint integration tests

[Jump to complete test code](#final-post-todos-integration-test-code)

Within the over-arching `describe('App todo endpoints integration tests')` block, add a `describe` block for the `POST /todos` route:

```javascript
describe('POST /todos', () => {})
```

## Add 'happy route' tests

```javascript
test.each(['Climb', 'Swim', 'Climb a tree'])(
  'should add a todo to the database and return status 201 and the created todo object when passed the todo: "%s"',
  async (task) => {
    // Act
    const response = await request(app).post('/todos').send({ task })

    // Assert
    expect(response.status).toBe(201)
    expect(response.body.task).toBe(task)
    expect(response.body.completed).toBe(false)
  },
)
```

## Add validation and error handling tests

```javascript
test.each([
  [undefined, 'No task was provided'],
  ['', 'The task property cannot be an empty string'],
  [212, 'Task must be a string but type number was given'],
  [['Hello world'], 'Task must be a string but type object was given'],
  [true, 'Task must be a string but type boolean was given'],
])(
  'should return status 400 and an appropriate error message when given task value: "%s"',
  async (task, errorMessage) => {
    // Act
    const response = await request(app).post('/todos').send({ task })

    // Assert
    expect(response.status).toBe(400)
    expect(response.body.message).toBe(errorMessage)
  },
)
```

[NEXT: Add the DELETE /todos/:id endpoint](5a_deleteTodo_endpoint.md)

### Final POST /todos integration test code

```javascript
describe('POST /todos', () => {
  test.each(['Climb', 'Swim', 'Climb a tree'])(
    'should add a todo to the database and return status 201 and the created todo object when passed the todo: "%s"',
    async (task) => {
      // Act
      const response = await request(app).post('/todos').send({ task })

      // Assert
      expect(response.status).toBe(201)
      expect(response.body.task).toBe(task)
      expect(response.body.completed).toBe(false)
    },
  )

  test.each([
    [undefined, 'No task was provided'],
    ['', 'The task property cannot be an empty string'],
    [212, 'Task must be a string but type number was given'],
    [['Hello world'], 'Task must be a string but type object was given'],
    [true, 'Task must be a string but type boolean was given'],
  ])(
    'should return status 400 and an appropriate error message when given task value: "%s"',
    async (task, errorMessage) => {
      // Act
      const response = await request(app).post('/todos').send({ task })

      // Assert
      expect(response.status).toBe(400)
      expect(response.body.message).toBe(errorMessage)
    },
  )
})
```

[NEXT: Add the DELETE /todos/:id endpoint](5a_deleteTodo_endpoint.md)