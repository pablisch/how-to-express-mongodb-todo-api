# GET /todos endpoint integration tests

[Jump to final code for this section](#final-get-todos-endpoint-integration-test-code)

In the `app.test.js` file, import `app`, `request` from `supertest` and the `seedTodos` function, and add the environment variable,`MONGODB_DATABASE_NAME` to set the database to the `todo_TEST` database.

```javascript
process.env.MONGODB_DATABASE_NAME = 'todo_TEST'

const request = require('supertest')
const app = require('./app')
const seedTodos = require('./seed/seedTodos')
```

**NOTE:** Setting the `MONGODB_DATABASE_NAME` environment variable overrides the default value of `todos_DEV`.

Start with an over-arching `describe` block and a `beforeEach` block to reset the database data before each test.

```javascript
describe('App todo endpoints integration tests', () => {
  beforeEach(async () => {
    await seedTodos(false)
  })
})
```

**NOTE:** the `beforeEach` block calls `seedTodos` to make sure that the database is in a set state before each test with the same three items in it so that each test is independent from all others in a completely controlled environment. The `false` argument passed in is for the `logSuccess` parameter and suppresses any console logging upon successful connection to the database or operation as this does not play nicely with tests. It is also used to stop the `process.exit` which would end the test run.

Within the over-arching `describe('App todo endpoints integration tests')` block, add a `describe` block for the `GET /todos/:id` route:

```javascript
describe('GET /todos', () => {})
```

## Add 'happy route' tests

```javascript
test('should return an array of all todos and status 200', async () => {
  // Act
  const response = await request(app).get('/todos')

  // Assert
  expect(response.status).toBe(200)
  const allTodos = response.body
  expect(allTodos.length).toBe(3)
  expect(allTodos[0].task).toBe('Eat')
  expect(allTodos[1].completed).toBe(false)
})
```

**NOTE:** The exact tests you choose are fairly optional.

### Run the integration tests

```bash
npm test
```

**At this point, the first API endpoint is complete, refactored, and fully tested.**

[NEXT: getTodoById controller unit tests](3a_getTodoById_endpoint.md)

## Final GET /todos endpoint integration test code

```javascript
process.env.MONGODB_DATABASE_NAME = 'todo_TEST'

const request = require('supertest')
const app = require('./app')
const seedTodos = require('./seed/seedTodos')

describe('App todo endpoints integration tests', () => {
  beforeEach(async () => {
    await seedTodos(false)
  })

  describe('GET /todos', () => {
    test('should return an array of all todos and status 200', async () => {
      // Act
      const response = await request(app).get('/todos')

      // Assert
      expect(response.status).toBe(200)
      const allTodos = response.body
      expect(allTodos.length).toBe(3)
      expect(allTodos[0].task).toBe('Eat')
      expect(allTodos[1].completed).toBe(false)
    })
  })
})
```

[NEXT: getTodoById controller unit tests](3a_getTodoById_endpoint.md)
