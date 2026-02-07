-- AlterEnum
ALTER TYPE "ExpertStatus" ADD VALUE 'NONE';

-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "expertRequest" SET DEFAULT 'NONE';
