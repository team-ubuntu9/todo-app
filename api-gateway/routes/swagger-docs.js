/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Récupérer tous les TODOs
 *     description: Retourne la liste complète des tâches TODO depuis la base de données PostgreSQL
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: Liste des TODOs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Todo'
 *             example:
 *               success: true
 *               data:
 *                 - id: "edbc0f32-a541-464d-9e27-5e40bf7ee01a"
 *                   title: "Installer l'environnement de dev"
 *                   description: "Configurer Node.js, npm, Docker et Prisma"
 *                   completed: false
 *                   priority: "high"
 *                   createdAt: "2025-09-25T20:53:21.000Z"
 *                   updatedAt: "2025-09-25T20:53:21.000Z"
 *               count: 1
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Créer un nouveau TODO
 *     description: Ajoute une nouvelle tâche TODO à la base de données
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTodoRequest'
 *           example:
 *             title: "Nouvelle tâche importante"
 *             description: "Description de la tâche à accomplir"
 *             priority: "high"
 *     responses:
 *       201:
 *         description: TODO créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Données invalides (titre manquant)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Title is required"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Récupérer un TODO par ID
 *     description: Retourne un TODO spécifique basé sur son identifiant UUID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant UUID du TODO
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "edbc0f32-a541-464d-9e27-5e40bf7ee01a"
 *     responses:
 *       200:
 *         description: TODO trouvé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Todo'
 *       404:
 *         description: TODO non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Todo not found"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Mettre à jour un TODO
 *     description: Modifie les propriétés d'un TODO existant
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant UUID du TODO à modifier
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTodoRequest'
 *           example:
 *             title: "Titre mis à jour"
 *             completed: true
 *             priority: "low"
 *     responses:
 *       200:
 *         description: TODO mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: TODO non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Supprimer un TODO
 *     description: Supprime définitivement un TODO de la base de données
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant UUID du TODO à supprimer
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: TODO supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Todo deleted successfully"
 *       404:
 *         description: TODO non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/todos/{id}/toggle:
 *   patch:
 *     summary: Basculer le statut d'un TODO
 *     description: Change l'état completed d'un TODO (true ↔ false)
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant UUID du TODO à basculer
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Statut du TODO basculé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Todo'
 *                     message:
 *                       type: string
 *                       example: "Todo marked as completed"
 *       404:
 *         description: TODO non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Vérifier la santé de l'API Gateway
 *     description: Endpoint de health check pour l'API Gateway
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service en bonne santé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 service:
 *                   type: string
 *                   example: "API Gateway"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-25T20:53:21.000Z"
 */

module.exports = {};
