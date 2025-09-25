const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = null;
    this.init();
  }

  init() {
    // Configuration de la connexion PostgreSQL
    const config = {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'todoapp',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
      max: 20, // Nombre maximum de connexions dans le pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

    this.pool = new Pool(config);

    // Gérer les erreurs de connexion
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });

    console.log('📊 Connected to PostgreSQL database');
    this.createTables();
  }

  async createTables() {
    const createTodosTable = `
      CREATE TABLE IF NOT EXISTS todos (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        priority VARCHAR(50) DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    try {
      await this.pool.query(createTodosTable);
      console.log('✅ Todos table ready');
    } catch (err) {
      console.error('Error creating todos table:', err.message);
    }
  }

  // Méthode pour obtenir tous les TODOs
  async getAllTodos() {
    try {
      const result = await this.pool.query(
        'SELECT * FROM todos ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (err) {
      throw new Error(`Error getting todos: ${err.message}`);
    }
  }

  // Méthode pour obtenir un TODO par ID
  async getTodoById(id) {
    try {
      const result = await this.pool.query(
        'SELECT * FROM todos WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (err) {
      throw new Error(`Error getting todo by ID: ${err.message}`);
    }
  }

  // Méthode pour créer un nouveau TODO
  async createTodo(todo) {
    try {
      const query = `
        INSERT INTO todos (id, title, description, completed, priority)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const values = [
        todo.id,
        todo.title,
        todo.description || '',
        todo.completed || false,
        todo.priority || 'medium'
      ];

      const result = await this.pool.query(query, values);
      return { id: todo.id, changes: 1, data: result.rows[0] };
    } catch (err) {
      throw new Error(`Error creating todo: ${err.message}`);
    }
  }

  // Méthode pour mettre à jour un TODO
  async updateTodo(id, updates) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      if (updates.title !== undefined) {
        fields.push(`title = $${paramCount}`);
        values.push(updates.title);
        paramCount++;
      }
      if (updates.description !== undefined) {
        fields.push(`description = $${paramCount}`);
        values.push(updates.description);
        paramCount++;
      }
      if (updates.completed !== undefined) {
        fields.push(`completed = $${paramCount}`);
        values.push(updates.completed);
        paramCount++;
      }
      if (updates.priority !== undefined) {
        fields.push(`priority = $${paramCount}`);
        values.push(updates.priority);
        paramCount++;
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const query = `
        UPDATE todos 
        SET ${fields.join(', ')} 
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await this.pool.query(query, values);
      return { id, changes: result.rowCount, data: result.rows[0] };
    } catch (err) {
      throw new Error(`Error updating todo: ${err.message}`);
    }
  }

  // Méthode pour supprimer un TODO
  async deleteTodo(id) {
    try {
      const result = await this.pool.query(
        'DELETE FROM todos WHERE id = $1',
        [id]
      );
      return { id, changes: result.rowCount };
    } catch (err) {
      throw new Error(`Error deleting todo: ${err.message}`);
    }
  }

  // Méthode pour tester la connexion
  async testConnection() {
    try {
      const result = await this.pool.query('SELECT NOW()');
      console.log('✅ Database connection test successful:', result.rows[0].now);
      return true;
    } catch (err) {
      console.error('❌ Database connection test failed:', err.message);
      return false;
    }
  }

  // Fermer le pool de connexions
  async close() {
    if (this.pool) {
      try {
        await this.pool.end();
        console.log('Database connection pool closed');
      } catch (err) {
        console.error('Error closing database pool:', err.message);
      }
    }
  }
}

module.exports = Database;
