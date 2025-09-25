const { v4: uuidv4 } = require('uuid');
// Utiliser la version sans Redis pour Docker
const Database = require('../database/database-no-redis');

class TodoController {
  constructor() {
    this.db = new Database();
  }

  // Récupérer tous les TODOs
  async getAllTodos(req, res) {
    try {
      const todos = await this.db.getAllTodos();
      res.status(200).json({
        success: true,
        data: todos,
        count: todos.length
      });
    } catch (error) {
      console.error('Error getting todos:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve todos'
      });
    }
  }

  // Récupérer un TODO par ID
  async getTodoById(req, res) {
    try {
      const { id } = req.params;
      const todo = await this.db.getTodoById(id);
      
      if (!todo) {
        return res.status(404).json({
          success: false,
          error: 'Todo not found'
        });
      }

      res.status(200).json({
        success: true,
        data: todo
      });
    } catch (error) {
      console.error('Error getting todo by ID:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve todo'
      });
    }
  }

  // Créer un nouveau TODO
  async createTodo(req, res) {
    try {
      const { title, description, priority = 'medium' } = req.body;

      if (!title || title.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Title is required'
        });
      }

      const newTodo = {
        id: uuidv4(),
        title: title.trim(),
        description: description ? description.trim() : '',
        completed: false,
        priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium'
      };

      await this.db.createTodo(newTodo);
      
      // Récupérer le TODO créé avec les timestamps
      const createdTodo = await this.db.getTodoById(newTodo.id);

      res.status(201).json({
        success: true,
        data: createdTodo,
        message: 'Todo created successfully'
      });
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create todo'
      });
    }
  }

  // Mettre à jour un TODO
  async updateTodo(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Vérifier si le TODO existe
      const existingTodo = await this.db.getTodoById(id);
      if (!existingTodo) {
        return res.status(404).json({
          success: false,
          error: 'Todo not found'
        });
      }

      // Valider les données
      if (updates.title !== undefined && updates.title.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Title cannot be empty'
        });
      }

      if (updates.priority && !['low', 'medium', 'high'].includes(updates.priority)) {
        return res.status(400).json({
          success: false,
          error: 'Priority must be low, medium, or high'
        });
      }

      // Nettoyer les données
      const cleanUpdates = {};
      if (updates.title !== undefined) cleanUpdates.title = updates.title.trim();
      if (updates.description !== undefined) cleanUpdates.description = updates.description.trim();
      if (updates.completed !== undefined) cleanUpdates.completed = Boolean(updates.completed);
      if (updates.priority !== undefined) cleanUpdates.priority = updates.priority;

      await this.db.updateTodo(id, cleanUpdates);
      
      // Récupérer le TODO mis à jour
      const updatedTodo = await this.db.getTodoById(id);

      res.status(200).json({
        success: true,
        data: updatedTodo,
        message: 'Todo updated successfully'
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update todo'
      });
    }
  }

  // Supprimer un TODO
  async deleteTodo(req, res) {
    try {
      const { id } = req.params;

      // Vérifier si le TODO existe
      const existingTodo = await this.db.getTodoById(id);
      if (!existingTodo) {
        return res.status(404).json({
          success: false,
          error: 'Todo not found'
        });
      }

      await this.db.deleteTodo(id);

      res.status(200).json({
        success: true,
        message: 'Todo deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete todo'
      });
    }
  }

  // Marquer un TODO comme terminé/non terminé
  async toggleTodo(req, res) {
    try {
      const { id } = req.params;

      const existingTodo = await this.db.getTodoById(id);
      if (!existingTodo) {
        return res.status(404).json({
          success: false,
          error: 'Todo not found'
        });
      }

      await this.db.updateTodo(id, { completed: !existingTodo.completed });
      const updatedTodo = await this.db.getTodoById(id);

      res.status(200).json({
        success: true,
        data: updatedTodo,
        message: `Todo marked as ${updatedTodo.completed ? 'completed' : 'pending'}`
      });
    } catch (error) {
      console.error('Error toggling todo:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to toggle todo'
      });
    }
  }
}

module.exports = TodoController;
