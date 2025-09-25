const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('🔧 Testing Prisma connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL via Prisma');
    
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log('✅ Query test successful:', result);
    
    await prisma.$disconnect();
    console.log('✅ Connection test completed successfully');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();
