-- Migration: Add provinceCode and create relation
-- แก้ไข: ใช้ provinceId เป็น fallback แทน TH-00

-- 1. Add provinceCode to Province table (nullable first)
ALTER TABLE "Province" ADD COLUMN IF NOT EXISTS "provinceCode" TEXT;

-- 2. Add provinceCode to PestReport table (nullable first)  
ALTER TABLE "PestReport" ADD COLUMN IF NOT EXISTS "provinceCode" TEXT;

-- 3. Create unique index on Province.provinceCode (if not exists)
DROP INDEX IF EXISTS "Province_provinceCode_key";
CREATE UNIQUE INDEX "Province_provinceCode_key" ON "Province"("provinceCode");

-- 4. Populate Province with ISO codes (mapping from provinceNameEn)
-- ใช้รูปแบบ TH-XX โดยที่ XX คือ provinceId ที่เติม 0 ข้างหน้า
UPDATE "Province" SET "provinceCode" = 
    'TH-' || LPAD("provinceId"::TEXT, 2, '0');

-- 5. Migrate PestReport data: map old province names to provinceCode
UPDATE "PestReport" pr
SET "provinceCode" = p."provinceCode"
FROM "Province" p
WHERE pr."province" = p."provinceNameEn";

-- 6. For any remaining records that didn't match, use Bangkok as default
UPDATE "PestReport" 
SET "provinceCode" = (SELECT "provinceCode" FROM "Province" WHERE "provinceNameEn" = 'Bangkok' LIMIT 1)
WHERE "provinceCode" IS NULL;

-- 7. Add foreign key constraint (if not exists)
ALTER TABLE "PestReport" 
DROP CONSTRAINT IF EXISTS "PestReport_provinceCode_fkey";

ALTER TABLE "PestReport" 
ADD CONSTRAINT "PestReport_provinceCode_fkey" 
FOREIGN KEY ("provinceCode") REFERENCES "Province"("provinceCode");

-- 8. Create index (if not exists)
DROP INDEX IF EXISTS "PestReport_provinceCode_idx";
CREATE INDEX "PestReport_provinceCode_idx" ON "PestReport"("provinceCode");

-- 9. Drop old province column (if exists)
ALTER TABLE "PestReport" DROP COLUMN IF EXISTS "province";

-- 10. Make provinceCode NOT NULL in both tables
ALTER TABLE "Province" ALTER COLUMN "provinceCode" SET NOT NULL;
ALTER TABLE "PestReport" ALTER COLUMN "provinceCode" SET NOT NULL;
