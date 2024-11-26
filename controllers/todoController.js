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
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return next({ status: 400, message: `${id} is not a valid todo ID` })
  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return next({ status: 404, error: `No todo with ID ${id} was found in the database` })
    }
    res.status(200).json(todo);
  } catch (error) {
    next(error)
  }
}

exports.createTodo = async (req, res, next) => {
  const { task } = req.body;
  if (!task) return next({ status: 400, message: `No task was given` })
  if (typeof task !== 'string') return next({status: 400, message: `Task must be a string but a ${typeof(task)} was given`})
  const todo = new Todo({
    task,
    completed: false,
  })
  try {
    await todo.save()
    res.status(201).json(todo);
  } catch (error) {
    next(error)
  }
};

exports.deleteTodo = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next({ status: 400, message: `${id} is not a valid todo ID` });
  }
  try {
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return next({ status: 404, message: `No todo with ID ${id} was found in the database` });
    }
    res.status(200).json({ message: `Todo with ID ${id} was successfully deleted` });
  } catch (error) {
    next(error);
  }
};

exports.updateTodo = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next({ status: 400, message: `${id} is not a valid todo ID` });
  }
  if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
    return next({ status: 400, message: 'Updates must be an object' });
  }
  try {
    const todo = await Todo.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
    );
    if (!todo) {
      return next({ status: 404, message: `No todo with ID ${id} was found in the database` });
    }
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};
