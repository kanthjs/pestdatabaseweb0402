import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function testExpertAccess() {
    console.log('\n=== Testing Expert Access ===\n');

    const expertEmail = 'expert1@demo.com';
    const expertId = '550e8400-e29b-41d4-a716-446655440003';

    // Test 1: Find by email
    console.log('Test 1: Finding user by email...');
    const userByEmail = await prisma.userProfile.findFirst({
        where: {
            OR: [
                { id: expertId },
                { email: expertEmail },
            ],
        },
        select: {
            id: true,
            email: true,
            role: true,
            userName: true,
        },
    });

    if (userByEmail) {
        console.log('✓ Found user:');
        console.log(`  ID: ${userByEmail.id}`);
        console.log(`  Email: ${userByEmail.email}`);
        console.log(`  Role: ${userByEmail.role}`);
        console.log(`  Username: ${userByEmail.userName}`);
    } else {
        console.log('✗ User not found!');
    }

    // Test 2: Check reports by this expert
    console.log('\nTest 2: Checking reports by expert...');
    const expertReports = await prisma.pestReport.count({
        where: {
            OR: [
                { reporterEmail: expertEmail },
                { reporterUser: { email: expertEmail } },
            ],
        },
    });
    console.log(`  Total reports: ${expertReports}`);

    // Test 3: Check all approved reports
    console.log('\nTest 3: Checking all approved reports...');
    const approvedReports = await prisma.pestReport.count({
        where: {
            status: 'APPROVED',
        },
    });
    console.log(`  Total approved: ${approvedReports}`);

    await prisma.$disconnect();
}

testExpertAccess().catch(console.error);
