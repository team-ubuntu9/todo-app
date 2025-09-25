const { PrismaClient } = require('@prisma/client');
const { createClient } = require('redis');

class Database {
  constructor() {
    this.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
    this.redis = null;
    this.init();
  }

  async init() {
    try {
      // Initialiser Redis
      this.redis = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 50, 500)
        }
      });

      this.redis.on('error', (err) => {
        console.error('Redis Client Error:', err);
      });

      this.redis.on('connect', () => {
        console.log('📦 Connected to Redis');
      });

      await this.redis.connect();

      // Tester la connexion Prisma
      await this.prisma.$connect();
      console.log('📊 Connected to PostgreSQL via Prisma');
      
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  // Cache helper methods
  async getFromCache(key) {
    try {
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async setCache(key, data, ttl = 300) {
    try {
      await this.redis.setEx(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async deleteFromCache(key) {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async clearCachePattern(pattern) {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(keys);
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  // Méthode pour obtenir tous les TODOs avec cache
  async getAllTodos() {
    const cacheKey = 'todos:all';
    
    try {
      // Vérifier le cache d'abord
      const cached = await this.getFromCache(cacheKey);
      if (cached) {
        console.log('📦 Returning todos from cache');
        return cached;
      }

      // Si pas en cache, récupérer de la DB
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

      // Mettre en cache
      await this.setCache(cacheKey, formattedTodos);
      
      return formattedTodos;
    } catch (error) {
      throw new Error(`Error getting todos: ${error.message}`);
    }
  }

  // Méthode pour obtenir un TODO par ID avec cache
  async getTodoById(id) {
    const cacheKey = `todo:${id}`;
    
    try {
      // Vérifier le cache d'abord
      const cached = await this.getFromCache(cacheKey);
      if (cached) {
        console.log(`📦 Returning todo ${id} from cache`);
        return cached;
      }

      // Si pas en cache, récupérer de la DB
      const todo = await this.prisma.todo.findUnique({
        where: { id }
      });

      if (!todo) return null;

      // Convertir l'enum en lowercase
      const formattedTodo = {
        ...todo,
        priority: todo.priority.toLowerCase()
      };

      // Mettre en cache
      await this.setCache(cacheKey, formattedTodo);
      
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

      // Invalider le cache
      await this.clearCachePattern('todos:*');
      await this.setCache(`todo:${newTodo.id}`, formattedTodo);

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

      // Invalider le cache
      await this.clearCachePattern('todos:*');
      await this.setCache(`todo:${id}`, formattedTodo);

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

      // Invalider le cache
      await this.clearCachePattern('todos:*');
      await this.deleteFromCache(`todo:${id}`);

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
      
      await this.redis.ping();
      console.log('✅ Redis connection test successful');
      
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
      await this.redis.quit();
      console.log('Database connections closed');
    } catch (error) {
      console.error('Error closing database connections:', error.message);
    }
  }
}

module.exports = Database;
