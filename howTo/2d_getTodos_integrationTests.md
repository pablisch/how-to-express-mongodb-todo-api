# GET /todos endpoint integration tests

In the app.test.js file, import `app`, `request` from `supertest` and the `seedTodos` function, and add the environment variable,`MONGODB_DATABASE_NAME` to set the database to the `todo_TEST` database.

```javascript
process.env.MONGODB_DATABASE_NAME = 'todo_TEST'

const request = require('supertest');
const app = require('./app');
const seedTodos = require('./seed/seedTodos');
```

Start with an overarching `describe` block and a `beforeEach` block to reset the database data before each test.

```javascript
describe('App todo endpoints integration tests', () => {
  beforeEach(async () => {
    await seedTodos(false);
  });
})
```

Write a test for the `GET` request to `/todos` inside the overarching `describe` block.

```javascript
describe('GET /todos', () => {
    test('should return an array of all todos and status 200', async () => {
        // Act
        const response = await request(app).get('/todos');
    
        // Assert
        expect(response.status).toBe(200)
        const allTodos = response.body
        expect(allTodos.length).toBe(3)
        expect(allTodos[0].task).toBe('Eat')
        expect(allTodos[1].completed).toBe(false)
    })
})
```

**NOTE:** The exact tests you choose are fairly optional.

### Run the integration tests

```bash
npm test
```

**At this point, the first API endpoint is complete, refactored, and fully tested.**

[NEXT: getTodoById controller unit tests](3a_getTodoById_endpoint.md)