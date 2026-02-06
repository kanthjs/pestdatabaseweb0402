import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

async function fix() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:54322/postgres"
  });

  try {
    console.log("Connecting to local database...");

    // 1. Ensure pestPics bucket exists
    console.log("Checking storage buckets...");
    const bucketCheck = await pool.query("SELECT id FROM storage.buckets WHERE id = 'pestPics'");
    if (bucketCheck.rows.length === 0) {
      console.log("Creating 'pestPics' bucket...");
      await pool.query("INSERT INTO storage.buckets (id, name, public) VALUES ('pestPics', 'pestPics', true)");
    } else {
      console.log("'pestPics' bucket already exists. Ensuring it is public...");
      await pool.query("UPDATE storage.buckets SET public = true WHERE id = 'pestPics'");
    }

    // 2. Fix Storage Policies
    console.log("Applying storage policies...");
    await pool.query(`
      DO $$
      BEGIN
        -- Ignore errors for these calls if they fail due to permissions, 
        -- but usually we can create policies if we can connect.
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public select for pestPics'
          ) THEN
            CREATE POLICY "Allow public select for pestPics" ON storage.objects FOR SELECT TO public USING (bucket_id = 'pestPics');
          END IF;
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Could not create select policy: %', SQLERRM;
        END;

        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public insert for pestPics'
          ) THEN
            CREATE POLICY "Allow public insert for pestPics" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'pestPics');
          END IF;
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Could not create insert policy: %', SQLERRM;
        END;
      END $$;
    `);

    // 3. Disable RLS on all public tables for local development
    console.log("Disabling RLS on all public tables...");
    const tablesRes = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    for (const row of tablesRes.rows) {
      if (row.table_name === '_prisma_migrations') continue;
      console.log(`Disabling RLS on "${row.table_name}"...`);
      await pool.query(`ALTER TABLE public."${row.table_name}" DISABLE ROW LEVEL SECURITY;`);
    }

    console.log("Successfully updated local database policies.");
  } catch (err) {
    console.error("Error during fix:", err);
  } finally {
    await pool.end();
  }
}

fix();
