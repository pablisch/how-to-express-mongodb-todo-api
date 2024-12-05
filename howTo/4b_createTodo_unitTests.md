# Write createTodo controller function unit tests

## Add 'happy route' unit tests for the createTodo function

In the todoController.test.js file, add `createTodo` to the imports.

```javascript
const { getAllTodos, getTodoById, createTodo } = require('./todoController');
```

Add a `describe` block for the `createTodo` function and a `test` block for the happy route.

```javascript
describe('createTodo()', () => {
    test.each(['Climb', 'Swim', 'Climb a tree'])('should add a todo to the database and return an array with the added todo and status 201', async (task) => {
        // Arrange
        const mReq = {
            body: {
                task
            }
        }
        const mRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const mNext = jest.fn()

        // Act
        await createTodo(mReq, mRes, mNext)

        // Assert
        expect(mRes.status).toHaveBeenCalledWith(201)
        const newTodo = mRes.json.mock.calls[0][0]
        expect(newTodo.task).toBe(task)
        expect(newTodo.completed).toBe(false)
    })
})
```

**NOTE:** Whilst we are checking that the API returns a todo object that is what we expect it to be, i.e. the `task` that we passed in and a `completed`
property value of `false`, the test could go further by calling the using the returned `_id`, calling the `GET /todos/:id` endpoint and asserting that the `todo` does exist in the database.

## Unit testing validation and error handling

In our `createTodo` function we validated and handled errors for:
- `task` being and empty string
- no `task`
- `task` not being a string

So now we need tests to make sure that these work correctly.

Add new parameterised tests providing each test with a `task` and `errorMessage` parameter.

```javascript
    test.each([
    [undefined, 'No task was provided'],
    ['', 'The task property cannot be an empty string'],
    [212, 'Task must be a string but type number was given'],
    [true, 'Task must be a string but type boolean was given'],
])('should return status 400 and an appropriate error message when passed task, "%s" in the request body', async (task, errorMessage) => {
    // Arrange
    const mReq = {
        body: {
            task
        }
    };
    const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const mNext = jest.fn();

    // Act
    await createTodo(mReq, mRes, mNext);

    // Assert
    expect(mRes.status).not.toHaveBeenCalled()
    expect(mNext).toHaveBeenCalledWith({ status: 400, message: errorMessage })
    const createTodoCall = mNext.mock.calls[0][0]
    expect(createTodoCall.status).toBe(400)
    expect(createTodoCall.message).toBe(errorMessage)
})
```

[NEXT: POST /todos integration tests](4c_createTodo_integrationTests.md)