const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    const dbPath = path.join(__dirname, '..', '..', 'data', 'todos.db');
    
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('📊 Connected to SQLite database');
        this.createTables();
      }
    });
  }

  createTables() {
    const createTodosTable = `
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT 0,
        priority TEXT DEFAULT 'medium',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createTodosTable, (err) => {
      if (err) {
        console.error('Error creating todos table:', err.message);
      } else {
        console.log('✅ Todos table ready');
      }
    });
  }

  // Méthode pour obtenir tous les TODOs
  getAllTodos() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM todos ORDER BY created_at DESC';
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Convertir les valeurs BOOLEAN
          const todos = rows.map(row => ({
            ...row,
            completed: Boolean(row.completed)
          }));
          resolve(todos);
        }
      });
    });
  }

  // Méthode pour obtenir un TODO par ID
  getTodoById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM todos WHERE id = ?';
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve({
            ...row,
            completed: Boolean(row.completed)
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  // Méthode pour créer un nouveau TODO
  createTodo(todo) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO todos (id, title, description, completed, priority)
        VALUES (?, ?, ?, ?, ?)
      `;
      const params = [
        todo.id,
        todo.title,
        todo.description || '',
        todo.completed ? 1 : 0,
        todo.priority || 'medium'
      ];

      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: todo.id, changes: this.changes });
        }
      });
    });
  }

  // Méthode pour mettre à jour un TODO
  updateTodo(id, updates) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const params = [];

      if (updates.title !== undefined) {
        fields.push('title = ?');
        params.push(updates.title);
      }
      if (updates.description !== undefined) {
        fields.push('description = ?');
        params.push(updates.description);
      }
      if (updates.completed !== undefined) {
        fields.push('completed = ?');
        params.push(updates.completed ? 1 : 0);
      }
      if (updates.priority !== undefined) {
        fields.push('priority = ?');
        params.push(updates.priority);
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      params.push(id);

      const sql = `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`;

      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, changes: this.changes });
        }
      });
    });
  }

  // Méthode pour supprimer un TODO
  deleteTodo(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM todos WHERE id = ?';
      this.db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, changes: this.changes });
        }
      });
    });
  }

  // Fermer la connexion à la base de données
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

module.exports = Database;
