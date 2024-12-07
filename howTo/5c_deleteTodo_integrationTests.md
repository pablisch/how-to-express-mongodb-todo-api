# DELETE /todos/:id endpoint integration tests

[Jump to complete test code](#final-delete-todosid-integration-test-code)

Within the over-arching `describe('App todo endpoints integration tests')` block, add a `describe` block for the `DELETE /todos/:id` route:

```javascript
describe('DELETE /todos/:id', () => {})
```

## Add 'happy route' tests

```javascript
test.each([
  ['123456789012345678901234', 'Eat', true],
  ['234567890123456789012345', 'Sleep', false],
  ['345678901234567890123456', 'Pray', false],
])(
  'should delete todo from database, and return status 200 and a success message when called with id: "%s"',
  async (id, task, completed) => {
    // Act
    const response = await request(app).delete(`/todos/${id}`)

    // Assert
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: `Todo with ID ${id} was successfully deleted`,
    })
  },
)
```

## Add validation and error handling tests

```javascript
test.each([
  ['cat', 400, "'cat' is not a valid todo ID"],
  [true, 400, "'true' is not a valid todo ID"],
  [
    '999999999999999999999999',
    404,
    'No todo with ID 999999999999999999999999 was found in the database',
  ],
])(
  'should return an appropriate status and error message when called with the id: "%s"',
  async (id, status, errorMessage) => {
    // Act
    const response = await request(app).delete(`/todos/${id}`)

    // Assert
    expect(response.status).toBe(status)
    expect(response.body.message).toBe(errorMessage)
    expect(response.body).toEqual({ message: errorMessage })
  },
)
```

[NEXT: Add the PATCH /todos/:id endpoint](6a_updateTodo_endpoint.md)

### Final DELETE /todos/:id integration test code

```javascript
describe('DELETE /todos/:id', () => {
  test.each([
    ['123456789012345678901234', 'Eat', true],
    ['234567890123456789012345', 'Sleep', false],
    ['345678901234567890123456', 'Pray', false],
  ])(
    'should delete todo from database, and return status 200 and a success message when called with id: "%s"',
    async (id, task, completed) => {
      // Act
      const response = await request(app).delete(`/todos/${id}`)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: `Todo with ID ${id} was successfully deleted`,
      })
    },
  )

  test.each([
    ['cat', 400, "'cat' is not a valid todo ID"],
    [true, 400, "'true' is not a valid todo ID"],
    [
      '999999999999999999999999',
      404,
      'No todo with ID 999999999999999999999999 was found in the database',
    ],
  ])(
    'should return an appropriate status and error message when called with the id: "%s"',
    async (id, status, errorMessage) => {
      // Act
      const response = await request(app).delete(`/todos/${id}`)

      // Assert
      expect(response.status).toBe(status)
      expect(response.body.message).toBe(errorMessage)
      expect(response.body).toEqual({ message: errorMessage })
    },
  )
})
```

[NEXT: Add the PATCH /todos/:id endpoint](6a_updateTodo_endpoint.md)