const express = require('express');
const TodoController = require('../controllers/todoController');

const router = express.Router();
const todoController = new TodoController();

// Routes pour les TODOs
router.get('/', (req, res) => todoController.getAllTodos(req, res));
router.get('/:id', (req, res) => todoController.getTodoById(req, res));
router.post('/', (req, res) => todoController.createTodo(req, res));
router.put('/:id', (req, res) => todoController.updateTodo(req, res));
router.delete('/:id', (req, res) => todoController.deleteTodo(req, res));
router.patch('/:id/toggle', (req, res) => todoController.toggleTodo(req, res));

module.exports = router;
