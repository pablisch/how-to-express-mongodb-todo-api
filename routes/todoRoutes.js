const { Router } = require('express');
const router = Router();

const { getAllTodos, getTodoById, createTodo } = require('../controllers/todoController');
// const { getAllTodos, getTodoById, addTodo, deleteTodo, updateTodo } = require('../controllers/todoController');

router.get('/', getAllTodos);

router.get('/:id', getTodoById);

router.post('/', createTodo);
//
// router.delete('/:id', deleteTodo);
//
// router.put('/:id', updateTodo);

module.exports = router;