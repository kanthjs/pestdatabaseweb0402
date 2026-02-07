import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verifyMasterData() {
    console.log('=== Verifying Master Data Logic ===');

    try {
        // 1. Create a Pest
        const pest = await prisma.pest.create({
            data: {
                pestId: 'TEST_PEST_001',
                pestNameEn: 'Test Pest 001',
                pestNameTh: 'ทดสอบศัตรูพืช 001',
                imageUrl: 'http://example.com/pest.jpg'
            }
        });
        console.log('Created Pest:', JSON.stringify(pest, null, 2));

        // 2. Read
        const readPest = await prisma.pest.findUnique({ where: { pestId: 'TEST_PEST_001' } });
        console.log('Read Pest:', JSON.stringify(readPest, null, 2));

        if (readPest && readPest.pestNameTh === 'ทดสอบศัตรูพืช 001') {
            console.log('✓ Pest creation and read successful');
        } else {
            console.error('✗ Pest read failed or data mismatch');
        }

        // 3. Delete
        await prisma.pest.delete({ where: { pestId: 'TEST_PEST_001' } });
        console.log('Deleted Pest TEST_PEST_001');

    } catch (e) {
        console.error('Verification failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

verifyMasterData();
