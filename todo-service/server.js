const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const todoRoutes = require('./src/routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Créer le dossier data s'il n'existe pas
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'TODO Service',
    timestamp: new Date().toISOString()
  });
});

// Route d'accueil
app.get('/', (req, res) => {
  res.json({
    message: 'TODO Service API',
    version: '1.0.0',
    endpoints: {
      'GET /api/todos': 'Récupérer toutes les tâches',
      'POST /api/todos': 'Créer une nouvelle tâche',
      'GET /api/todos/:id': 'Récupérer une tâche par ID',
      'PUT /api/todos/:id': 'Mettre à jour une tâche',
      'DELETE /api/todos/:id': 'Supprimer une tâche',
      'PATCH /api/todos/:id/toggle': 'Basculer le statut d\'une tâche'
    }
  });
});

// Routes pour les TODOs
app.use('/api/todos', todoRoutes);

// Middleware pour gérer les routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: 'The requested endpoint does not exist' 
  });
});

// Middleware de gestion d'erreurs globales
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: 'Something went wrong!' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 TODO Service running on port ${PORT}`);
  console.log(`📊 Database will be created at ${path.join(dataDir, 'todos.db')}`);
  console.log(`🌐 Service accessible at http://localhost:${PORT}`);
});
