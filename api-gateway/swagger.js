const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TODO API - Microservices',
      version: '1.0.0',
      description: 'API REST pour la gestion de tâches (TODOs) avec architecture microservices',
      contact: {
        name: 'API Support',
        email: 'support@todoapp.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Serveur de développement (API Gateway)'
      },
      {
        url: 'http://localhost:3001',
        description: 'Service TODO direct'
      }
    ],
    components: {
      schemas: {
        Todo: {
          type: 'object',
          required: ['title'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identifiant unique du TODO',
              example: 'edbc0f32-a541-464d-9e27-5e40bf7ee01a'
            },
            title: {
              type: 'string',
              maxLength: 500,
              description: 'Titre du TODO',
              example: 'Finir le projet TODO'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Description détaillée du TODO',
              example: 'Implémenter toutes les fonctionnalités CRUD et la documentation Swagger'
            },
            completed: {
              type: 'boolean',
              description: 'Statut de completion du TODO',
              example: false
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Niveau de priorité du TODO',
              example: 'high'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création',
              example: '2025-09-25T20:53:21.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière modification',
              example: '2025-09-25T20:53:21.000Z'
            }
          }
        },
        CreateTodoRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              maxLength: 500,
              description: 'Titre du TODO (obligatoire)',
              example: 'Nouvelle tâche importante'
            },
            description: {
              type: 'string',
              description: 'Description du TODO (optionnel)',
              example: 'Description détaillée de la tâche à accomplir'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Priorité du TODO (défaut: medium)',
              example: 'high'
            }
          }
        },
        UpdateTodoRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              maxLength: 500,
              description: 'Nouveau titre du TODO',
              example: 'Titre modifié'
            },
            description: {
              type: 'string',
              description: 'Nouvelle description du TODO',
              example: 'Description mise à jour'
            },
            completed: {
              type: 'boolean',
              description: 'Nouveau statut de completion',
              example: true
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Nouvelle priorité du TODO',
              example: 'low'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indique si la requête a réussi',
              example: true
            },
            data: {
              description: 'Données retournées par l\'API'
            },
            count: {
              type: 'integer',
              description: 'Nombre d\'éléments retournés (pour les listes)',
              example: 5
            },
            message: {
              type: 'string',
              description: 'Message de confirmation',
              example: 'Todo created successfully'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Message d\'erreur',
              example: 'Todo not found'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Todos',
        description: 'Opérations CRUD sur les tâches TODO'
      },
      {
        name: 'Health',
        description: 'Endpoints de santé des services'
      }
    ]
  },
  apis: ['./routes/*.js', './server.js'], // Chemins vers les fichiers contenant les annotations Swagger
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
