-- Seed Supabase Auth Users
-- These users correspond to the seeded UserProfile records in Prisma
-- The UUIDs must match between Supabase Auth and Prisma UserProfile.id

-- Note: These are example users for development only
-- Password for all demo users: Demo@123456

-- To create these users, use the Supabase Dashboard or CLI:
-- 
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" for each user below
-- 3. Use the email and set password to: Demo@123456
-- 4. The UUID should match the id field below (if possible)
--
-- OR use Supabase CLI:
-- supabase auth admin createuser --email reporter1@demo.com --password Demo@123456
-- (Then manually update the UUID in auth.users to match the Prisma seed)

-- ============================================
-- USER 1: Reporter One (Regular User)
-- ============================================
-- Email: reporter1@demo.com
-- Password: Demo@123456
-- Profile ID (Prisma): 550e8400-e29b-41d4-a716-446655440001
-- Role: USER

-- ============================================
-- USER 2: Reporter Two (Regular User)
-- ============================================
-- Email: reporter2@demo.com
-- Password: Demo@123456
-- Profile ID (Prisma): 550e8400-e29b-41d4-a716-446655440002
-- Role: USER

-- ============================================
-- USER 3: Expert One (Expert User)
-- ============================================
-- Email: expert1@demo.com
-- Password: Demo@123456
-- Profile ID (Prisma): 550e8400-e29b-41d4-a716-446655440003
-- Role: EXPERT
-- Note: Expert users can review pending reports and their submissions are auto-approved

-- ============================================
-- USER 4: User One (Regular User)
-- ============================================
-- Email: user1@demo.com
-- Password: Demo@123456
-- Profile ID (Prisma): 550e8400-e29b-41d4-a716-446655440004
-- Role: USER

-- ============================================
-- USER 5: Admin One (Admin User)
-- ============================================
-- Email: admin1@demo.com
-- Password: Demo@123456
-- Profile ID (Prisma): 550e8400-e29b-41d4-a716-446655440005
-- Role: ADMIN
-- Note: Admin users have full access including expert review capabilities

-- ============================================
-- SQL to insert auth users (run in Supabase SQL Editor)
-- ============================================
-- WARNING: This requires the pgcrypto extension

/*
-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert auth users with matching UUIDs
-- Note: The encrypted password is for 'Demo@123456'

INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    'reporter1@demo.com',
    crypt('Demo@123456', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Reporter","last_name":"One"}',
    NOW(),
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'reporter2@demo.com',
    crypt('Demo@123456', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Reporter","last_name":"Two"}',
    NOW(),
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'expert1@demo.com',
    crypt('Demo@123456', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Expert","last_name":"One"}',
    NOW(),
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440004',
    'user1@demo.com',
    crypt('Demo@123456', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"User","last_name":"One"}',
    NOW(),
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440005',
    'admin1@demo.com',
    crypt('Demo@123456', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Admin","last_name":"One"}',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    updated_at = NOW();
*/
