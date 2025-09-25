const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
const { swaggerUi, specs } = require('./swagger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const TODO_SERVICE_URL = process.env.TODO_SERVICE_URL || 'http://localhost:3001';

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'TODO API Documentation'
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'API Gateway',
    timestamp: new Date().toISOString()
  });
});

// Route pour servir une page d'accueil simple
app.get('/', (req, res) => {
  res.json({
    message: 'TODO Application API Gateway',
    version: '1.0.0',
    documentation: 'http://localhost:' + PORT + '/api-docs',
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

// Middleware pour proxy vers le service TODO
const proxyToTodoService = async (req, res) => {
  try {
    // Construire l'URL correcte pour le service TODO
    const servicePath = req.originalUrl.replace('/api/todos', '/api/todos');
    const url = `${TODO_SERVICE_URL}${servicePath}`;
    
    const config = {
      method: req.method,
      url: url,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      }
    };

    if (req.body && Object.keys(req.body).length > 0) {
      config.data = req.body;
    }

    console.log(`Proxying ${req.method} ${req.originalUrl} to ${url}`);
    
    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      res.status(503).json({ 
        error: 'Service Unavailable', 
        message: 'TODO service is not available' 
      });
    } else {
      res.status(500).json({ 
        error: 'Internal Server Error', 
        message: 'An error occurred while processing your request' 
      });
    }
  }
};

// Routes pour les TODOs - toutes les requêtes sont proxifiées vers le service TODO
app.use('/api/todos', proxyToTodoService);

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
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📡 Proxying to TODO service at ${TODO_SERVICE_URL}`);
  console.log(`🌐 Access the application at http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
});
