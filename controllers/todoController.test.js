process.env.MONGODB_DATABASE_NAME = 'todo_TEST'

const seedTodos = require('../seed/seedTodos')
const {
  getAllTodos,
  getTodoById,
  createTodo,
  deleteTodo,
  updateTodo,
} = require('./todoController')
const Todo = require('../models/todo')

describe('Todo routes controller functions unit tests', () => {
  beforeEach(async () => {
    await seedTodos(false)
  })

  describe('getAllTodos()', () => {
    test('should return an array of all todo objects and status 200', async () => {
      // Arrange
      const mReq = {}
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mNext = jest.fn()

      // Act
      await getAllTodos(mReq, mRes, mNext)

      // Assert
      expect(mRes.status).toBeCalledWith(200)
      const todos = mRes.json.mock.calls[0][0]

      expect(todos.length).toBe(3)
      expect(todos[0].task).toBe('Eat')
      expect(todos[0]).toMatchObject({ task: 'Eat', completed: true })
      expect(todos[1]).toMatchObject({ task: 'Sleep', completed: false })
      expect(todos[2]).toMatchObject({ task: 'Pray', completed: false })

      const now = Date.now()
      todos.forEach((todo) => {
        expect(todo).toHaveProperty('_id')
        expect(todo._id.toString()).toMatch(/^[a-f\d]{24}$/i)
        expect(todo).toHaveProperty('createdAt')
        expect(todo).toHaveProperty('updatedAt')
        expect(new Date(todo.createdAt).getTime() < now)
        expect(new Date(todo.updatedAt).getTime() < now)
      })
    })
  })

  describe('getTodoById()', () => {
    test.each([
      ['123456789012345678901234', 'Eat', true],
      ['234567890123456789012345', 'Sleep', false],
      ['345678901234567890123456', 'Pray', false],
    ])(
      'should return a single todo object and status 200 when called with the id param : "%s"',
      async (id, task, completed) => {
        // Arrange
        const mReq = {
          params: {
            id,
          },
        }
        const mRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        const mNext = jest.fn()

        // Act
        await getTodoById(mReq, mRes, mNext)

        // Assert
        expect(mRes.status).toBeCalledWith(200)
        const todo = mRes.json.mock.calls[0][0]
        expect(todo._id.toString()).toBe(id)
        expect(todo.task).toBe(task)
        expect(todo.completed).toBe(completed)
        expect(todo.createdAt).toBeInstanceOf(Date)
        expect(todo.updatedAt).toBeInstanceOf(Date)
        expect(todo.__v).toBe(0)
      },
    )

    test.each([
      [
        '999999999999999999999999',
        404,
        'No todo with ID 999999999999999999999999 was found in the database',
      ],
      ['dog', 400, `'dog' is not a valid todo ID`],
      [true, 400, `'true' is not a valid todo ID`],
    ])(
      'should return an appropriate status and error message when called with id: "%s"',
      async (id, status, errorMessage) => {
        // Arrange
        const mReq = {
          params: {
            id,
          },
        }
        const mRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        const mNext = jest.fn()

        // Act
        await getTodoById(mReq, mRes, mNext)

        // Assert
        expect(mRes.status).not.toHaveBeenCalled()
        expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
        const todoCall = mNext.mock.calls[0][0]
        expect(todoCall.status).toBe(status)
        expect(todoCall.message).toBe(errorMessage)
      },
    )
  })

  describe('createTodo()', () => {
    test.each(['Climb', 'Swim', 'Climb a tree'])(
      'should add a todo to the database and return the new todo and status 201 when passed task: "%s"',
      async (task) => {
        // Arrange
        const mReq = {
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
        await createTodo(mReq, mRes, mNext)

        // Assert
        expect(mRes.status).toHaveBeenCalledWith(201)
        const newTodo = mRes.json.mock.calls[0][0]
        expect(newTodo.task).toBe(task)
        expect(newTodo.completed).toBe(false)
      },
    )

    test.each([
      [undefined, 'No task was provided'],
      ['', 'The task property cannot be an empty string'],
      [212, 'Task must be a string but type number was given'],
      [true, 'Task must be a string but type boolean was given'],
    ])(
      'should return status 400 and an appropriate error message when passed task: "%s"',
      async (task, errorMessage) => {
        // Arrange
        const mReq = {
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
        await createTodo(mReq, mRes, mNext)

        // Assert
        expect(mRes.status).not.toHaveBeenCalled()
        expect(mNext).toHaveBeenCalledWith({
          status: 400,
          message: errorMessage,
        })
        const createTodoCall = mNext.mock.calls[0][0]
        expect(createTodoCall.status).toBe(400)
        expect(createTodoCall.message).toBe(errorMessage)
      },
    )
  })

  describe('deleteTodo()', () => {
    test.each([
      ['123456789012345678901234', 'Eat', true],
      ['234567890123456789012345', 'Sleep', false],
      ['345678901234567890123456', 'Pray', false],
    ])(
      'should delete todo with id: "%s" from the database and return status 200 with a success confirmation message',
      async (id, task, completed) => {
        // Arrange
        const mReq = {
          params: {
            id,
          },
        }
        const mRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        const mNext = jest.fn()

        // Act
        await deleteTodo(mReq, mRes, mNext)

        // Assert
        expect(mRes.status).toHaveBeenCalledWith(200)
        expect(mRes.json).toHaveBeenCalledWith({
          message: `Todo with ID ${id} was successfully deleted`,
        })

        // Act
        const todo = await Todo.findById(id)

        // Assert
        expect(todo).toBeNull()
      },
    )

    test.each([
      [
        '999999999999999999999999',
        404,
        'No todo with ID 999999999999999999999999 was found in the database',
      ],
      ['cat', 400, `'cat' is not a valid todo ID`],
      [true, 400, `'true' is not a valid todo ID`],
    ])(
      'should return status 400 and an appropriate error message when passed task: "%s"',
      async (id, status, errorMessage) => {
        // Arrange
        const mReq = {
          params: {
            id,
          },
        }
        const mRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        const mNext = jest.fn()

        // Act
        await deleteTodo(mReq, mRes, mNext)

        // Assert
        expect(mRes.status).not.toHaveBeenCalled()
        expect(mNext).toHaveBeenCalledWith({ status, message: errorMessage })
        expect(mNext.mock.calls[0][0].status).toBe(status)
        expect(mNext.mock.calls[0][0].message).toBe(errorMessage)
      },
    )
  })

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
        expect(mNext.mock.calls[0][0]).toEqual({
          status,
          message: errorMessage,
        })
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
        expect(mNext.mock.calls[0][0]).toEqual({
          status,
          message: errorMessage,
        })
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
        expect(mNext.mock.calls[0][0]).toEqual({
          status,
          message: errorMessage,
        })
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
        expect(mNext.mock.calls[0][0]).toEqual({
          status,
          message: errorMessage,
        })
      },
    )
  })
})
