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
})
