const { Router } = require('express')
const router = Router()

const {
  getAllTodos,
  getTodoById,
  createTodo,
  deleteTodo,
  updateTodo,
} = require('../controllers/todoController')

router.get('/', getAllTodos)

router.get('/:id', getTodoById)

router.post('/', createTodo)

router.delete('/:id', deleteTodo)

router.patch('/:id', updateTodo)

module.exports = router
