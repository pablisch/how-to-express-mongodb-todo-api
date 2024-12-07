# GET /todos/:id endpoint integration tests

[Jump to final code for this section](#final-get-todosid-integration-test-code)

Within the over-arching `describe('App todo endpoints integration tests')` block, add a `describe` block for the `GET /todos/:id` route:

```javascript
describe('GET /todos/:id', () => {})
```

## Add 'happy route' tests

```javascript
test.each([
  ['123456789012345678901234', 'Eat', true],
  ['234567890123456789012345', 'Sleep', false],
  ['345678901234567890123456', 'Pray', false],
])(
  'should return an array with a single todo and status 200 when called with an ID param: "%s"',
  async (id, task, completed) => {
    // Act
    const response = await request(app).get(`/todos/${id}`)

    // Assert
    expect(response.status).toBe(200)
    const retrievedTodo = response._body
    expect(retrievedTodo.task).toBe(task)
    expect(retrievedTodo.completed).toBe(completed)
  },
)
```

## Add validation and error handling tests

```javascript
test.each([
  [
    '999999999999999999999999',
    404,
    'No todo with ID 999999999999999999999999 was found in the database',
  ],
  ['dog', 400, "'dog' is not a valid todo ID"],
  [true, 400, "'true' is not a valid todo ID"],
])(
  'should return an appropriate status and error message when called with an ID param: "%s"',
  async (id, status, errorMessage) => {
    // Act
    const response = await request(app).get(`/todos/${id}`)

    // Assert
    expect(response.status).toBe(status)
    expect(response.body.message).toBe(errorMessage)
  },
)
```

[NEXT: Add the POST /todos endpoint](4a_createTodo_endpoint.md)

### Final GET /todos/:id integration test code

```javascript
describe('GET /todos/:id', () => {
  test.each([
    ['123456789012345678901234', 'Eat', true],
    ['234567890123456789012345', 'Sleep', false],
    ['345678901234567890123456', 'Pray', false],
  ])(
    'should return an array with a single todo and status 200 when called with an ID param: "%s"',
    async (id, task, completed) => {
      // Act
      const response = await request(app).get(`/todos/${id}`)

      // Assert
      expect(response.status).toBe(200)
      const retrievedTodo = response._body
      expect(retrievedTodo.task).toBe(task)
      expect(retrievedTodo.completed).toBe(completed)
    },
  )

  test.each([
    [
      '999999999999999999999999',
      404,
      'No todo with ID 999999999999999999999999 was found in the database',
    ],
    ['dog', 400, "'dog' is not a valid todo ID"],
    [true, 400, "'true' is not a valid todo ID"],
  ])(
    'should return an appropriate status and error message when called with an ID param: "%s"',
    async (id, status, errorMessage) => {
      // Act
      const response = await request(app).get(`/todos/${id}`)

      // Assert
      expect(response.status).toBe(status)
      expect(response.body.message).toBe(errorMessage)
    },
  )
})
```

[NEXT: Add the POST /todos endpoint](4a_createTodo_endpoint.md)
