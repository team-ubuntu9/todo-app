const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  // Some initial TODOs
  const todos = [
    {
      id: uuidv4(),
      title: 'Installer l\'environnement de dev',
      description: 'Configurer Node.js, npm, Docker et Prisma',
      completed: false,
      priority: 'HIGH',
    },
    {
      id: uuidv4(),
      title: 'Créer la structure du projet',
      description: 'API Gateway + Service TODO + Postgres + Redis',
      completed: false,
      priority: 'MEDIUM',
    },
    {
      id: uuidv4(),
      title: 'Implémenter les endpoints CRUD',
      description: 'GET/POST/PUT/DELETE sur /api/todos',
      completed: false,
      priority: 'HIGH',
    },
    {
      id: uuidv4(),
      title: 'Ajouter le cache Redis',
      description: 'Mise en cache des listes et détails de TODOs',
      completed: false,
      priority: 'MEDIUM',
    },
    {
      id: uuidv4(),
      title: 'Rédiger la documentation',
      description: 'GUIDE_DOCKER.md et GUIDE_PRATIQUE_SERVICES.md',
      completed: false,
      priority: 'LOW',
    },
  ];

  // Insert seed data
  await prisma.todo.createMany({ data: todos });

  console.log(`✅ Seed terminé: ${todos.length} TODOs insérés/assurés.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
