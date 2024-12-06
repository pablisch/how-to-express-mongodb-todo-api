# How to build an Express Todo API with MongoDB Atlas Database setup

* This project is simply to outline the processes involved in setting up an Express API with a MongoDB Atlas database.
* This example uses `todos` but the principle is the same for any API.
* Code files included are purely intended as an example of the instructions provided in this README.md file and the accompanying markdown instruction files in [howTo](howTo).
* The order in which much of the API and database instructions are carried is largely optional. These instructions provide one possible order.

## Set up

The purpose of this project as a guide, not to run the API, but should you wish to run the API included in this repo, then follow these steps:
* Clone this repository.
* Run `npm install` to install the dependencies.
* Create a `.env` file in the root of the project and add the following environment variables:
  * `MONGODB_USERNAME=<your-username>`
  * `MONGODB_PASSWORD=<your-password>`
  * `MONGODB_DATABASE_NAME=<your-database-name>`
  * `MONGODB_CLUSTER_REF=<your-cluster-reference>` e.g. cluster0.kdyng
* NOTE: this requires a MongoDB Atlas database instance
* Replace `MONGODB_USERNAME`, `MONGODB_PASSWORD`, `MONGODB_DATABASE_NAME` and `MONGODB_CLUSTER_REF` with your Mongo DB Atlas details.
* Create a database called `todo_DEV` in MongoDB Atlas.
* Run the scripts `npm run seed:todos:dev` and `npm run seed:todos:test` to seed the databases.
* Run `npm start` to start the server.
* Use a tool like Postman to make requests to the API.
* Run `npm test` to run the tests.

## Contents

### Setup - database, repository, Express server and connections

1. [MongoDB database and connecting to MongoDB Compass](howTo/1a_setUp_mongoDbDatabase.md)
2. [Set up the repository](howTo/1b_setUp_repository.md)
3. [Create a basic Express server](howTo/1c_setUp_expressServer.md)
4. [Create the Todo schema and seeds](howTo/1d_setUp_todoSchemaAndSeeds.md)
5. [Database connection](howTo/1e_setUp_databaseConnection.md)
6. [Create the seeding function and scripts](howTo/1f_setUp_seedingFunctions.md)
7. [Connect the server and the database](howTo/1g_setUp_connectServerAndDatabase.md)

### GET /todos

**NOTE:** Choose either [Step 1](howTo/2a_getTodos_stepByStep.md) or [Step 2](howTo/2b_getTodos_StraightToController.md) here as they both end at exactly the same point. If you are unconfident with Express servers then [Step 1](howTo/2a_getTodos_stepByStep.md) may be beneficial. If you are familiar with the controller/route pattern then go straight to [Step 2](howTo/2b_getTodos_StraightToController.md).

1. [Step by step - starting in app.js](howTo/2a_getTodos_stepByStep.md)
2. [Add the GET /todos endpoint (directly as controller function and route)](howTo/2b_getTodos_StraightToController.md)
3. [getAllTodos controller function unit test](howTo/2c_getTodos_UnitTests.md)
4. [GET /todos endpoint integration tests](howTo/2d_getTodos_integrationTests.md)

### GET /todos/:id

1. [GET /todos/:id_endpoint](howTo/3a_getTodoById_endpoint.md)
2. [getTodoById_controller unit tests](howTo/3b_getTodoById_unitTests.md)
3. [GET /todos/:id_endpoint_integration tests](howTo/3c_getTodoById_integrationTests.md)

### POST /todos

1. [POST /todos_endpoint](howTo/4a_createTodo_endpoint.md)
2. [createTodo_controller unit tests](howTo/4b_createTodo_unitTests.md)
3. [POST /todos_endpoint_integration tests](howTo/4c_createTodo_integrationTests.md)

### DELETE /todos/:id

1. [DELETE /todos/:id_endpoint](howTo/5a_deleteTodo_endpoint.md)
2. [deleteTodo_controller unit tests](howTo/5b_deleteTodo_unitTests.md)
3. [DELETE /todos/:id_endpoint_integration tests](howTo/5c_deleteTodo_integrationTests.md)

### PATCH /todos/:id

1. [PATCH /todos/:id_endpoint](howTo/6a_updateTodo_endpoint.md)
2. [updateTodo_controller happy path unit tests](howTo/6b_updateTodo_happyPathUnitTests.md)
3. [updateTodo_controller error handling unit tests](howTo/6c_updateTodo_errorHandlingUnitTests.md)
4. [PATCH /todos/:id_endpoint happy path_integration tests](howTo/6c_updateTodo_happyPathIntegrationTests.md)
5. [PATCH /todos/:id_endpoint error handling_integration tests](howTo/6c_updateTodo_errorHandlingIntegrationTests.md)

-----

15. [DELETE /todos/:id 1 - Basic deleteTodo controller function and unit tests](#delete-todosid-1---basic-deletetodo-controller-function-and-unit-tests)
16. [DELETE /todos/:id 2 - Error handling in the deleteTodo controller function and unit testing errors](#delete-todosid-2---error-handling-in-the-deletetodo-controller-function-and-unit-testing-errors)
17. [DELETE /todos/:id 3 - Add the deleteTodo route and write integration tests](#delete-todosid-3---add-the-deletetodo-route-and-write-integration-tests)
18. [PUT /todos/:id 1 - Basic updateTodo controller function and unit tests](#put-todosid-1---basic-updatetodo-controller-function-and-unit-tests)
19. [PUT /todos/:id 2 - Error handling in the updateTodo controller function and unit testing errors](#put-todosid-2---error-handling-in-the-updatetodo-controller-function-and-unit-testing-errors)
20. [PUT /todos/:id 3 - Add the updateTodo route and write integration tests](#put-todosid-3---add-the-updatetodo-route-and-write-integration-tests)
21. [Notes on the Tests in this Repo](#notes-on-the-tests-in-this-repo)










## POST /todos 3 - Add the addTodo route and write integration tests

### Create the addTodo route

Add the `addTodo` function to the todoController imports.
```javascript
const { getAllTodos, getTodoById, addTodo } = require('../controllers/todoController');
```

Add the addTodo route:
```javascript
router.post('/', addTodo);
```

### Add 'happy route' integration tests for the addTodo route

Within the over-arching `describe` block in the app.test.js file:
```javascript
describe('POST /todos', () => {
    test.each(['Climb', 'Swim', 'Climb a tree'])('should add a todo to the database and return status 201 and an array containing the created todo object', async (task) => {
      // Act
      const response = await request(app).post('/todos').send({ task });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.length).toBe(1);
      expect(response.body[0].task).toBe(task);
      expect(response.body[0].completed).toBe(false);
    })
  })
```

### Add integration tests for invalid `task` parameters

Within the `POST /todos` `describe` block:
```javascript
test.each([
      [undefined, 'No task was provided.'],
      ['', 'No task was provided.'],
      [212, 'Task must be a string.'],
      [true, 'Task must be a string.'],
    ])('should return status 400 and an appropriate error message when given task value of %s', async (task, errorMessage) => {
      // Act
      const response = await request(app).post('/todos').send({ task });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(errorMessage);
    })
```

**NOTE:** Traditionally, the `PUT` route comes next but I always feel that it is the most complex of all the routes and so I have left it until last. 

## DELETE /todos/:id 1 - Basic deleteTodo controller function and unit tests

### Create the basic deleteTodo controller function

In the todoController.js file, create the `deleteTodo` function:
```javascript
const deleteTodo = async (req, res, next) => {
  const id = getIdNumber(req);
  const deleteTodoQuery = 'DELETE FROM todos WHERE id = $1 RETURNING *';

  try {
    const results = await pool.query(deleteTodoQuery, [id]);
    res.status(200).json(results.rows);
  } catch (error) {
    next(error);
  }
}
```

Add `deleteTodo` to the exports:
```javascript
module.exports = {
  getAllTodos,
  getTodoById,
  addTodo,
  deleteTodo
};
```

### Create 'happy route' tests for the deleteTodo controller function

In the todoController.test.js file, add `deleteTodo` to the imports.
```javascript
const { getAllTodos, getTodoById, addTodo, deleteTodo } = require('./todoController');
```

Add a `describe` block for the `deleteTodo` function and a `test` block for the happy route.
```javascript
describe('deleteTodo()', () => {
    test.each([
      [1, 'Eat', true],
      [2, 'Sleep', false],
      [3, 'Pray', false]
    ])('should delete todo with id %s from the database and return status 200 and an array containing only the deleted todo object', async (id, task, completed) => {
      // Arrange
      const mReq = {
        params: {
          id
        }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mNext = jest.fn();

      // Act
      await deleteTodo(mReq, mRes, mNext);

      // Assert
      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.json).toHaveBeenCalledWith([{ id, task, completed }]);
      expect(mRes.json.mock.calls[0][0].length).toBe(1);
      expect(mRes.json.mock.calls[0][0][0].task).toBe(task)
    })
  })
```

## DELETE /todos/:id 2 - Error handling in the deleteTodo controller function and unit testing errors

### Validate the `id` parameter

Right after the `id` is returned from the `getIdNumber` function, add a check to see if it is exists. `getIdNumber` returns `null` if the `id` is not a number.
```javascript
if (!id) return next({ status: 400, message: 'Invalid id provided. ID must be a number.' });
```

And right after the database query, add a check to see if `results.rows` is empty, i.e. the id was not found.
```javascript
if (!results.rows.length) return next({ status: 404, message: `No todo with an ID of ${id} could be found in the database.` });
```

### Add controller function tests for invalid and not found `id` parameters

Add new parameterised tests providing each test with an `id`, `status` and `errorMessage` parameter.
```javascript
test.each([
      ['cat', 400, 'Invalid id provided. ID must be a number.'],
      [true, 400, 'Invalid id provided. ID must be a number.'],
      [2000, 404, 'No todo with an ID of 2000 could be found in the database.'],
    ])('should return an appropriate status and error message when passed params ID of "%s"', async (id, status, errorMessage) => {
      // Arrange
      const mReq = {
        params: {
          id
        }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mNext = jest.fn();

      // Act 
      await deleteTodo(mReq, mRes, mNext);

      // Assert
      expect(mRes.status).not.toHaveBeenCalled();
      expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage });
      expect(mNext.mock.calls[0][0].status).toBe(status);
      expect(mNext.mock.calls[0][0].message).toBe(errorMessage);
    })
```

## DELETE /todos/:id 3 - Add the deleteTodo route and write integration tests

### Create the deleteTodo route

Add the `deleteTodo` function to the todoController imports.
```javascript
const { getAllTodos, getTodoById, addTodo, deleteTodo } = require('../controllers/todoController');
```

Add the deleteTodo route:
```javascript
router.delete('/:id', deleteTodo);
```

### Add 'happy route' integration tests for the deleteTodo route

Within the over-arching `describe` block in the app.test.js file:
```javascript
describe('DELETE /todos/:id', () => {
    test.each([
      // [1, 'Eat', true],
      [2, 'Sleep', false],
    ])('should delete todo from database and return status 200 and an array with the deleted todo object with id, "%s"', async (id, task, completed) => {
      // Act 
      const response = await request(app).delete(`/todos/${id}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id, task, completed }]);
      expect(response.body[0].id).toBe(id);
      expect(response.body[0].task).toBe(task);
      expect(response.body[0].completed).toBe(completed);
    })
  })
```

### Add integration tests for invalid and not found `id` parameters

Within the `DELETE /todos/:id` `describe` block:
```javascript
test.each([
  ['cat', 400, 'Invalid id provided. ID must be a number.'],
  [true, 400, 'Invalid id provided. ID must be a number.'],
  [2000, 404, 'No todo with an ID of 2000 could be found in the database.'],
])('should return an appropriate status and error message when passed the ID param, "%s"', async (id, status, errorMessage) => {
  // Act
  const response = await request(app).delete(`/todos/${id}`);

  // Assert
  expect(response.status).toBe(status);
  expect(response.body.message).toBe(errorMessage);
  expect(response.body).toEqual({ message: errorMessage });
})
```

## Update endpoint considerations

For updating there are two options:
- `PUT` for updating a whole object and needs all properties
- `PATCH` for updating selective properties

**NOTE:** I used to do this exclusively with PATCH which is a more complex way that would allow for only updated data to be sent to the function. Whilst this worked well, it is much easier to work on the assumption that all properties will be sent in the request, i.e. even if only one property is being updated, all properties will be sent. This is the approach I will take here. The previous code is shown below for reference.

PROS: 
* Works with limited data sent in the request.
* Only updates data that needs updating.

CONS:
* More complex logic.

Here, I will show both but start with the easier `PUT` method.

## PUT /todos/:id 1 - Basic updatePutTodo controller function and unit tests

### Create the basic updateTodo controller function

In the todoController.js file, create the `updateTodo` function:
```javascript
const updatePutTodo = async (req, res, next) => {
  const id = getIdNumber(req);
  const { task, completed } = req.body;
  
  const updateTodoQuery = 'UPDATE todos SET task = $1, completed = $2 WHERE id = $3 RETURNING *';

  try {
    const results = await pool.query(updateTodoQuery, [task, completed, id]);
    res.status(201).json(results.rows);
  } catch (error) {
    next (error)
  }
}
```

Add `updatePutTodo` to the exports:
```javascript
module.exports = {
  getAllTodos,
  getTodoById,
  addTodo,
  deleteTodo,
  updatePutTodo
};
```

### Create 'happy route' tests for the updatePutTodo controller function

In the todoController.test.js file, add `updatePutTodo` to the imports.
```javascript
const { getAllTodos, getTodoById, addTodo, deleteTodo, updatePutTodo } = require('./todoController');
```

Add a `describe` block for the `updatePutTodo` function and a `test` block for the happy route.
```javascript
describe('updatePutTodo()', () => {
    test.each([
      [1, "Jump", false],
      [2, "Dream", true],
      [1, "Swim", true],
    ])('should update todo in the database and return status 201 and the updated todo object', async (id, task, completed) => {
      // Arrange
      const mReq = {
        params: {
          id
        },
        body: {
          task, completed
        }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mNext = jest.fn();

      // Act 
      await updateTodo(mReq, mRes, mNext);

      // Assert
      expect(mRes.status).toHaveBeenCalledWith(201);
      expect(mRes.json).toHaveBeenCalledWith([{ id, task, completed }]);
      expect(mRes.json.mock.calls[0][0].length).toBe(1);
      expect(mRes.json.mock.calls[0][0][0].id).toBe(id);
      expect(mRes.json.mock.calls[0][0][0].task).toBe(task);
      expect(mRes.json.mock.calls[0][0][0].completed).toBe(completed);
    })
  });
```

## PUT /todos/:id 2 - Error handling in the updatePutTodo controller function and unit testing errors

### Validate the id, task and completed parameters

Right after the `id` is returned from the `getIdNumber` function, add a check to see if it is exists. `getIdNumber` returns `null` if the `id` is not a number.
```javascript
if (!id && id !== 0) return next({status: 400, message: 'Invalid id provided. ID must be a number.'})
```

Right after the `task` and `completed` are destructured from `req.body`, add a check to see if they are `undefined` or an empty string. If they are, return an error.
```javascript
if (!task || !completed && completed !== false) return next({ status: 400, message: 'Task and completed properties are required to update this todo.' });
```

Directly after this, check that `completed` is a boolean and `task` is a string.
```javascript
if (typeof completed !== 'boolean') return next({status: 400, message: 'The completed property must be of type boolean.'})
  if (typeof task !== 'string') return next({status: 400, message: 'The task property must be of type string.'})
```

Lastly, check that a todo with the given `id` was found in the database.
```javascript
if (!results.rows.length) return next({ status: 404, message: `No todo with an ID of ${id} could be found in the database.` });
```

### Add controller function tests for invalid and not found `id` parameters

Add new parameterised tests providing each test with an `id`, `task`, `completed`, `status` and `errorMessage` parameter.
```javascript
test.each([
  [1, '', false, 400, 'Task and completed properties are required to update this todo.'],
  [2, 'Dream', undefined, 400, 'Task and completed properties are required to update this todo.'],
  [3, 'Dream', 'fish', 400, 'The completed property must be of type boolean.'],
  [1, 'Dream', 212, 400, 'The completed property must be of type boolean.'],
  [2, true, true, 400, 'The task property must be of type string.'],
  [3, 212, true, 400, 'The task property must be of type string.'],
  [3, 'Fly', 'pig', 400, 'The completed property must be of type boolean.'],
  [3000, 'Put', true, 404, 'No todo with an ID of 3000 could be found in the database.'],
  [0, 'Put', true, 404, 'No todo with an ID of 0 could be found in the database.']
])('should return an appropriate status and error message for todo with id of "%s", task "%s" and completed property "%s"',
  async (id, task, completed, status, errorMessage) => {
    // Arrange
    const mReq = {
      params: { id },
      body: {
        task,
        completed
      }
    }
    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    const mNext = jest.fn()

    // Act
    await updatePutTodo(mReq, mRes, mNext)

    // Assert
    expect(mRes.status).not.toHaveBeenCalled()
    expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
    expect(mNext.mock.calls[0][0]).toEqual({
      status,
      message: errorMessage
    })
    expect(mNext.mock.calls[0][0].status).toBe(status)
    expect(mNext.mock.calls[0][0].message).toBe(errorMessage)
  }
)
```

## PUT /todos/:id 3 - Add the updatePutTodo route and write integration tests

### Create the updateTodo route

Add the `updatePutTodo` function to the todoController imports.
```javascript
const { getAllTodos, getTodoById, addTodo, deleteTodo, updatePutTodo } = require('../controllers/todoController');
```

Add the updateTodo route:
```javascript
router.put('/:id', updateTodo);
```

### Add 'happy route' integration tests for the updateTodo route

Within the over-arching `describe` block in the app.test.js file:
```javascript
describe('UPDATE PUT /todos/:id', () => {
    test.each([
      [1, 'Eat', false],
      [2, 'Dream', true],
      [3, 'Pray', true],
      [1, 'Swim', false],
      [2, 'Dream', false],
    ])('should update todo in the database and return status 201 and an array with the updated todo object with id, "%s"', async (id, task, completed) => {
      // Act 
      const response = await request(app).put(`/todos/${id}`).send({ task, completed });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual([{ id, task, completed }]);
      expect(response.body[0].id).toBe(id);
      expect(response.body[0].task).toBe(task);
      expect(response.body[0].completed).toBe(completed);
    });
  });
  ```

  ### Add integration tests for invalid id, task and completed data and not found `id` parameters

Within the `UPDATE /todos/:id` `describe` block:
```javascript
test.each([
  [1, '', false, 400, 'Task and completed properties are required to update this todo.'],
  [2, 'Dream', undefined, 400, 'Task and completed properties are required to update this todo.'],
  [3, 'Dream', 'fish', 400, 'The completed property must be of type boolean.'],
  [1, 'Dream', 212, 400, 'The completed property must be of type boolean.'],
  [2, true, true, 400, 'The task property must be of type string.'],
  [3, 212, true, 400, 'The task property must be of type string.'],
  [3000, 'Fly', 'pig', 400, 'The completed property must be of type boolean.'],
  ['cat', 'Fly', true, 400, 'Invalid id provided. ID must be a number.'],
  [3000, 'Fly', true, 404, 'No todo with an ID of 3000 could be found in the database.'],
])('should return an appropriate status and error message when passed the ID param, "%s"', async (id, task, completed, status, errorMessage) => {
  // Act
  const response = await request(app).put(`/todos/${id}`).send({ task, completed });

  // Assert
  expect(response.status).toBe(status);
  expect(response.body.message).toBe(errorMessage);
  expect(response.body).toEqual({ message: errorMessage });
});
```

## PATCH /todos/:id 1 - Basic updatePatchTodo controller function and unit tests

All in all, this way seems like a more performant way of doing things. It is perhaps unnecessary in such a small application but the logic might get quite out of hand in a larger case scenario.

```javascript
const updatePatchTodo = async (req, res, next) => {
  const id = getIdNumber(req);

  const { task, completed } = req.body;
  const { query, params } = constructUpdateQuery(id, task, completed);

  if (params.length < 2) return next({ status: 400, message: 'No update data provided' });

  try {
    const results = await pool.query(query, params);
    if (!results.rows.length) return next({ status: 404, message: `No todo with an ID of ${id} could be found in the database.` });
    res.status(201).json(results.rows);
  } catch (error) {
    next (error)
  }
}

const constructUpdateQuery = (id, task, completed) => {
  const params = [];
  const values = [];
  if (task) {
    params.push(task);
    values.push(`task = $${params.length}`);
  };
  if (completed !== undefined) {
    params.push(completed);
    values.push(`completed = $${params.length}`);
  };
  params.push(id);
  const query = `UPDATE todos SET ${values.join(', ')} WHERE id = $${params.length} RETURNING *`;

  return { query, params };
}
```

The `constructUpdateQuery` function constructs the query and the parameters according to the data sent in the request and NOT all of the data in the object. This is the logic part that makes the `PUT` request more complex than `PATCH` although there might well be a far simpler way of achieving this.

Add `updatePatchTodo` to the exports:
```javascript
module.exports = {
  getAllTodos,
  getTodoById,
  addTodo,
  deleteTodo,
  updatePutTodo,
  updatePatchTodo
};
```

### Create 'happy route' tests for the updateTodo controller function

In the todoController.test.js file, add `updatePatchTodo` to the imports.
```javascript
const { getAllTodos, getTodoById, addTodo, deleteTodo, updatePutTodo, updatePatchTodo } = require('./todoController');
```

Add a `describe` block for the `updatePatchTodo` function and a `test` block for the happy route.
```javascript
describe('updatePatchTodo()', () => {
    test.each([
      [1, "Jump", false],
      [2, "Dream", true],
      [1, "Swim", true],
    ])('should update todo in the database and return status 201 and the updated todo object', async (id, task, completed) => {
      // Arrange
      const mReq = {
        params: {
          id
        },
        body: {
          task, completed
        }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mNext = jest.fn();

      // Act 
      await updateTodo(mReq, mRes, mNext);

      // Assert
      expect(mRes.status).toHaveBeenCalledWith(201);
      expect(mRes.json).toHaveBeenCalledWith([{ id, task, completed }]);
      expect(mRes.json.mock.calls[0][0].length).toBe(1);
      expect(mRes.json.mock.calls[0][0][0].id).toBe(id);
      expect(mRes.json.mock.calls[0][0][0].task).toBe(task);
      expect(mRes.json.mock.calls[0][0][0].completed).toBe(completed);
    })
  });
```

## PATCH /todos/:id 2 - Error handling in the updatePatchTodo controller function and unit testing errors

### Validate the id, task and completed parameters

Right after the `id` is returned from the `getIdNumber` function, add a check to see if it is exists. `getIdNumber` returns `null` if the `id` is not a number.
```javascript
if (!id && id !== 0) return next({status: 400, message: 'Invalid id provided. ID must be a number.'})
```

Right after the `task` and `completed` are destructured from `req.body`, add a check to see if both are `undefined` or an empty string. If neither are valid, return an error. This differs from `PUT` since only a single property is needed to perform the update.
```javascript
if (!task && (!completed && completed !== false)) return next({ status: 400, message: 'Either task or completed property are required to update this todo. Neither was provided.' });
```

Directly after this, check that `completed` is a boolean and `task` is a string if they are passed in. Again, for `PATCH` neither one is required since we have established by this point that at least one is present.
```javascript
if (completed && typeof completed !== 'boolean') return next({status: 400, message: 'If provided, the completed property must be of type boolean.'})
  if (task && typeof task !== 'string') return next({status: 400, message: 'If provided, the task property must be of type string.'})
```

Lastly, check that a todo with the given `id` was found in the database.
```javascript
if (!results.rows.length) return next({ status: 404, message: `No todo with an ID of ${id} could be found in the database.` });
```

### Add controller function tests for invalid and not found `id` parameters

Add new parameterised tests providing each test with an `id`, `task`, `completed`, `status` and `errorMessage` parameter.
```javascript
test.each([
  [true, 'Patch', true, 400, 'Invalid id provided. ID must be a number.'],
  [1, '', undefined, 400, 'Either task or completed property are required to update this todo. Neither was provided.'],
  [1, undefined, undefined, 400, 'Either task or completed property are required to update this todo. Neither was provided.'],
  [100, undefined, undefined, 400, 'Either task or completed property are required to update this todo. Neither was provided.'],
  [1, '', 'hello', 400, 'If provided, the completed property must be of type boolean.'],
  [1, 303, true, 400, 'If provided, the task property must be of type string.'],
  [1, true, true, 400, 'If provided, the task property must be of type string.'],
  [1, 'Patch', 303, 400, 'If provided, the completed property must be of type boolean.'],
  [1, '', 303, 400, 'If provided, the completed property must be of type boolean.'],
  [1, '', 'Patch', 400, 'If provided, the completed property must be of type boolean.'],
  [3000, 'Fly', true, 404, 'No todo with an ID of 3000 could be found in the database.'],
  [0, 'Fly', true, 404, 'No todo with an ID of 0 could be found in the database.']
])('should return an appropriate status and error message for todo with id of "%s", task "%s" and completed property "%s"',
  async (id, task, completed, status, errorMessage) => {
    // Arrange
    const mReq = {
      params: { id },
      body: {
        task,
        completed
      }
    }
    const mRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    const mNext = jest.fn()

    // Act
    await updatePatchTodo(mReq, mRes, mNext)

    // Assert
    expect(mRes.status).not.toHaveBeenCalled()
    expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
    expect(mNext.mock.calls[0][0]).toEqual({
      status,
      message: errorMessage
    })
    expect(mNext.mock.calls[0][0].status).toBe(status)
    expect(mNext.mock.calls[0][0].message).toBe(errorMessage)
  }
)
```

## PATCH /todos/:id 3 - Add the updatePatchTodo route and write integration tests

### Create the updateTodo route

Add the `updatePatchTodo` function to the todoController imports.
```javascript
const { getAllTodos, getTodoById, addTodo, deleteTodo, updatePutTodo, updatePatchTodo } = require('../controllers/todoController');
```

Add the updateTodo route:
```javascript
router.patch('/:id', updatePatchTodo);
```

### Add 'happy route' integration tests for the updateTodo route

Within the over-arching `describe` block in the app.test.js file:
```javascript
describe('UPDATE PATCH /todos/:id', () => {
  test.each([
    [1, 'Eat', false],
    [2, 'Dream', true],
    [2, 'Dream', false],
  ])('should update todo in the database and return status 201 and an array with a completely updated todo with when id = %s, task = %s and completed = %s', async (id, task, completed) => {
    // Act
    const response = await request(app).patch(`/todos/${id}`).send({ task, completed });

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toEqual([{ id, task, completed }]);
    expect(response.body[0].id).toBe(id);
    expect(response.body[0].task).toBe(task);
    expect(response.body[0].completed).toBe(completed);
  });

  test.each([
    [3, 'Dream', undefined],
    [2, undefined, true],
    [1, undefined, false],
  ])('should update todo in the database and return status 201 and an array with a partially updated todo when id = %s, task = %s and completed = %s', async (id, task, completed) => {
    // Act
    const response = await request(app).patch(`/todos/${id}`).send({ task, completed });

    // Assert
    expect(response.status).toBe(201);
    expect(response.body[0].id).toBe(id);
  });
});
  ```

### Add integration tests for invalid id, task and completed data and not found `id` parameters

Within the `UPDATE PATCH /todos/:id` `describe` block:
```javascript
test.each([
  [1, '', undefined, 400, 'Either task or completed property are required to update this todo. Neither was provided.'],
  [2, undefined, undefined, 400, 'Either task or completed property are required to update this todo. Neither was provided.'],
  [3, undefined, "teapot", 400, 'If provided, the completed property must be of type boolean.'],
  [3, undefined, 13, 400, 'If provided, the completed property must be of type boolean.'],
  [3, true, false, 400, 'If provided, the task property must be of type string.'],
  [3, 13, false, 400, 'If provided, the task property must be of type string.'],
  [30, "Patch", false, 404, 'No todo with an ID of 30 could be found in the database.'],
  [0, "Patch", false, 404, 'No todo with an ID of 0 could be found in the database.'],
])('should return an appropriate status and error message when id = %s, task = %s and completed = %s', async (id, task, completed, status, errorMessage) => {
  // Act
  const response = await request(app).patch(`/todos/${id}`).send({ task, completed });

  // Assert
  expect(response.status).toBe(status);
  expect(response.body.message).toBe(errorMessage);
  expect(response.body).toEqual({ message: errorMessage });
});
```

## Notes on the Tests in this Repo

### Integration Tests

These test the API endpoints and the database together. They are written in the `app.test.js` file and use the `supertest` package to make requests to the server and check the responses.

Example:
```javascript
const response = await request(app).post('/todos').send({ task });
```

Here, `request(app)` is a function from `supertest` that makes a request to the server and `.post('/todos')` is the type of request and the endpoint. `.send({ task })` is the data being sent with the request.

In the `response` object, you can check the status code and the body of the response, e.g.
```javascript
expect(response.status).toBe(200);
expect(response.body.length).toBe(1);
expect(response.body[0].task).toBe(task);
expect(response.body[0].completed).toBe(completed);
```

### Controller Function Unit Tests

These test the controller functions in isolation and use `Jest` to mock the `req` and `res` objects, and the `next` function.

Example:
```javascript
// Arrange
const mReq = {
  params: { id },
  body: {task, completed}
};
const mRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
}
const mNext = jest.fn();
```
This is the most complex example taken from an `updateTodo` function test. 

The `mReq` object is a mock request object with `params` and `body` properties. 
The `mRes` object is a mock response object with `status` and `json` methods. 
`mNext` is a mock of the `next` function.

It is important to note here that `status` and `json` are both methods that have parameters passed to them. 

In the assertions, there are two principle approaches. 
* Assert a method `toHaveBeenCalledWith` a specific parameter.
* Assert the value of an argument of a call in the `mock.calls` array.

#### The `toHaveBeenCalledWith` approach

Given the controller function code:
```javascript
res.status(200).json(results.rows);
```

We can see that `res` has been called with the argument `200` and `json` has been called with the argument `results.rows`.

For the sake of example, let's say that `results.rows` is an array with a single object in it:
```javascript
const results = {
  rows: [
    { id: 1, task: 'Eat', completed: true }
  ]
}
```

The `mock.calls` array is an array of the calls to a method.
So, `mock.calls[0]` is the first call to the method.
And, `mock.calls[0][0]` is the first argument of the first call to the method, which in the above example is an array containing a single object.
And so on, `mock.calls[0][0][0]` is the first (and in this case only) object in the array.

It follows then, that `mRes.status.mock.calls[0][0]` is the first argument of the first call to the `status` method of the `mRes` object which is the mock of the `res` object.

So, following the example above, we can assert:
```javascript
expect(mRes.status).toHaveBeenCalledWith(200);
expect(mRes.json).toHaveBeenCalledWith([{ id: 1, task: 'Eat', completed: true }]);
```

But, we can also assert:
```javascript
expect(mRes.status.mock.calls[0][0]).toBe(200);
expect(mRes.json.mock.calls[0][0]).toBe([{ id: 1, task: 'Eat', completed: true }]);
```

Or even:
```javascript
expect(mRes.status.mock.calls[0][0]).toBe(200);
expect(mRes.json.mock.calls[0][0][0].id).toBe(1);
expect(mRes.json.mock.calls[0][0][0].task).toBe('Eat');
expect(mRes.json.mock.calls[0][0][0].completed).toBe(true);
```

These are ways of saying the same thing. In some cases one is easier and more readable than others.

### Test results

<img src="./images/express-test.png" alt="home screen" width="500" />

This shows the results of the tests in the terminal when run with `--watchAll`.

Although there are 66 tests in this case, many are duplicated in their functionality to demonstrate different ways of doing the same thing which should not be done in a real world scenario.