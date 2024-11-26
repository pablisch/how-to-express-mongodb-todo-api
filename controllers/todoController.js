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


// const deleteTodo = async (req, res, next) => {
//   const id = getIdNumber(req);
//   if (!id) return next({ status: 400, message: 'Invalid id provided. ID must be a number.' });
//
//   const deleteTodoQuery = 'DELETE FROM todos WHERE id = $1 RETURNING *';
//
//   try {
//     const results = await pool.query(deleteTodoQuery, [id]);
//     if (!results.rows.length) return next({ status: 404, message: `No todo with an ID of ${id} could be found in the database.` });
//     res.status(200).json(results.rows);
//   } catch (errro) {
//     next(error);
//   }
// }
//
// const updateTodo = async (req, res, next) => {
//   const id = getIdNumber(req);
//   if (!id) return next({ status: 400, message: 'Invalid id provided. ID must be a number.' });
//
//   const { task, completed } = req.body;
//   if (!task || !completed && completed !== false) return next({ status: 400, message: 'Task and completed properties are required to update this todo.' });
//   if (typeof completed !== 'boolean') return next({status: 400, message: 'The completed property must be of type boolean.'})
//   if (typeof task !== 'string') return next({status: 400, message: 'The task property must be of type string.'})
//
//   const updateTodoQuery = 'UPDATE todos SET task = $1, completed = $2 WHERE id = $3 RETURNING *';
//
//   try {
//     const results = await pool.query(updateTodoQuery, [task, completed, id]);
//     if (!results.rows.length) return next({ status: 404, message: `No todo with an ID of ${id} could be found in the database.` });
//     res.status(201).json(results.rows);
//   } catch (error) {
//     next (error)
//   }
// }
//
