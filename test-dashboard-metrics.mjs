// Test script to verify getDashboardMetrics works with email filtering
import { getDashboardMetrics } from '../src/app/dashboard/actions';
import { subDays } from 'date-fns';

async function testDashboardMetrics() {
    const endDate = new Date();
    const startDate = subDays(endDate, 30);

    console.log('Testing getDashboardMetrics...');
    console.log('Date range:', startDate, 'to', endDate);

    // Test 1: Global data (no email filter)
    console.log('\n--- Test 1: Global Data (APPROVED reports only) ---');
    try {
        const globalData = await getDashboardMetrics(startDate, endDate);
        console.log('✓ Global data fetched successfully');
        console.log('  - Total reports ever:', globalData.totalReportsEver);
        console.log('  - Reports in period:', globalData.totalVerified.count);
        console.log('  - Top pest:', globalData.topPest?.name);
    } catch (error) {
        console.error('✗ Error fetching global data:', error);
    }

    // Test 2: Personal data (with email filter)
    console.log('\n--- Test 2: Personal Data (filtered by email) ---');
    const testEmail = 'test@example.com'; // Replace with actual test email
    try {
        const personalData = await getDashboardMetrics(startDate, endDate, testEmail);
        console.log('✓ Personal data fetched successfully');
        console.log('  - Total reports ever:', personalData.totalReportsEver);
        console.log('  - Reports in period:', personalData.totalVerified.count);
        console.log('  - Top pest:', personalData.topPest?.name);
    } catch (error) {
        console.error('✗ Error fetching personal data:', error);
    }

    console.log('\n--- Tests Complete ---');
}

testDashboardMetrics().catch(console.error);
