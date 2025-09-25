const { PrismaClient } = require('@prisma/client');

class Database {
  constructor() {
    this.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
    this.init();
  }

  async init() {
    try {
      console.log('🔧 Mode sans Redis - Cache désactivé');
      
      // Tester la connexion Prisma
      await this.prisma.$connect();
      console.log('📊 Connected to PostgreSQL via Prisma');
      
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  // Cache helper methods (désactivés - retournent null ou ne font rien)
  async getFromCache(key) {
    // Pas de cache - retourne toujours null
    return null;
  }

  async setCache(key, data, ttl = 300) {
    // Pas de cache - ne fait rien
    return;
  }

  async deleteFromCache(key) {
    // Pas de cache - ne fait rien
    return;
  }

  async clearCachePattern(pattern) {
    // Pas de cache - ne fait rien
    return;
  }

  // Méthode pour obtenir tous les TODOs (sans cache)
  async getAllTodos() {
    try {
      console.log('📦 Récupération directe depuis la base de données (pas de cache)');
      
      // Récupérer directement de la DB
      const todos = await this.prisma.todo.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Convertir les enums en lowercase pour compatibilité
      const formattedTodos = todos.map(todo => ({
        ...todo,
        priority: todo.priority.toLowerCase()
      }));

      return formattedTodos;
    } catch (error) {
      throw new Error(`Error getting todos: ${error.message}`);
    }
  }

  // Méthode pour obtenir un TODO par ID (sans cache)
  async getTodoById(id) {
    try {
      console.log(`📦 Récupération directe du todo ${id} depuis la base de données`);
      
      // Récupérer directement de la DB
      const todo = await this.prisma.todo.findUnique({
        where: { id }
      });

      if (!todo) return null;

      // Convertir l'enum en lowercase
      const formattedTodo = {
        ...todo,
        priority: todo.priority.toLowerCase()
      };

      return formattedTodo;
    } catch (error) {
      throw new Error(`Error getting todo by ID: ${error.message}`);
    }
  }

  // Méthode pour créer un nouveau TODO
  async createTodo(todo) {
    try {
      const newTodo = await this.prisma.todo.create({
        data: {
          id: todo.id,
          title: todo.title,
          description: todo.description || '',
          completed: todo.completed || false,
          priority: todo.priority ? todo.priority.toUpperCase() : 'MEDIUM'
        }
      });

      // Convertir l'enum en lowercase
      const formattedTodo = {
        ...newTodo,
        priority: newTodo.priority.toLowerCase()
      };

      return { id: newTodo.id, changes: 1, data: formattedTodo };
    } catch (error) {
      throw new Error(`Error creating todo: ${error.message}`);
    }
  }

  // Méthode pour mettre à jour un TODO
  async updateTodo(id, updates) {
    try {
      const updateData = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.priority !== undefined) updateData.priority = updates.priority.toUpperCase();

      const updatedTodo = await this.prisma.todo.update({
        where: { id },
        data: updateData
      });

      // Convertir l'enum en lowercase
      const formattedTodo = {
        ...updatedTodo,
        priority: updatedTodo.priority.toLowerCase()
      };

      return { id, changes: 1, data: formattedTodo };
    } catch (error) {
      throw new Error(`Error updating todo: ${error.message}`);
    }
  }

  // Méthode pour supprimer un TODO
  async deleteTodo(id) {
    try {
      await this.prisma.todo.delete({
        where: { id }
      });

      return { id, changes: 1 };
    } catch (error) {
      throw new Error(`Error deleting todo: ${error.message}`);
    }
  }

  // Méthode pour tester la connexion
  async testConnection() {
    try {
      await this.prisma.$queryRaw`SELECT NOW()`;
      console.log('✅ Prisma connection test successful');
      
      console.log('✅ Mode sans Redis - Cache désactivé');
      
      return true;
    } catch (error) {
      console.error('❌ Database connection test failed:', error.message);
      return false;
    }
  }

  // Fermer les connexions
  async close() {
    try {
      await this.prisma.$disconnect();
      console.log('Database connections closed');
    } catch (error) {
      console.error('Error closing database connections:', error.message);
    }
  }
}

module.exports = Database;
