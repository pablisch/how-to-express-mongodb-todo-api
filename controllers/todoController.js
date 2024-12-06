const Todo = require('../models/todo')
const mongoose = require('mongoose')

exports.getAllTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find()
    res.status(200).json(todos)
  } catch (error) {
    next(error)
  }
}

exports.getTodoById = async (req, res, next) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return next({ status: 400, message: `'${id}' is not a valid todo ID` })
  try {
    const todo = await Todo.findById(id)
    if (!todo) {
      return next({
        status: 404,
        message: `No todo with ID ${id} was found in the database`,
      })
    }
    res.status(200).json(todo)
  } catch (error) {
    next(error)
  }
}

exports.createTodo = async (req, res, next) => {
  const { task } = req.body
  if (task === '')
    return next({
      status: 400,
      message: 'The task property cannot be an empty string',
    })
  if (!task) return next({ status: 400, message: `No task was provided` })
  if (typeof task !== 'string')
    return next({
      status: 400,
      message: `Task must be a string but type ${typeof task} was given`,
    })
  const todo = new Todo({
    task,
    completed: false,
  })
  try {
    await todo.save()
    res.status(201).json(todo)
  } catch (error) {
    next(error)
  }
}

exports.deleteTodo = async (req, res, next) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next({ status: 400, message: `'${id}' is not a valid todo ID` })
  }
  try {
    const todo = await Todo.findByIdAndDelete(id)
    if (!todo) {
      return next({
        status: 404,
        message: `No todo with ID ${id} was found in the database`,
      })
    }
    res
      .status(200)
      .json({ message: `Todo with ID ${id} was successfully deleted` })
  } catch (error) {
    next(error)
  }
}

exports.updateTodo = async (req, res, next) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next({ status: 400, message: `'${id}' is not a valid todo ID` })
  }
  const updates = req.body
  if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
    return next({
      status: 400,
      message: 'The request body must be a valid JS object',
    })
  }
  const { task, completed } = req.body
  if (task === '')
    return next({
      status: 400,
      message:
        'Task cannot be an empty string. If a task property is sent, it must be a valid string',
    })
  if (!task && !completed && completed !== false) {
    return next({
      status: 400,
      message: 'Updating a todo requires a task and/or completed property',
    })
  }
  if (task && typeof task !== 'string')
    return next({
      status: 400,
      message: `Task property must be a string. Received type ${typeof task}`,
    })
  if (completed && typeof completed !== 'boolean')
    return next({
      status: 400,
      message: `Completed property must be a Boolean. Received type ${typeof completed}`,
    })
  try {
    const todo = await Todo.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
    if (!todo) {
      return next({
        status: 404,
        message: `No todo with ID ${id} was found in the database`,
      })
    }
    res.status(200).json(todo)
  } catch (error) {
    next(error)
  }
}
