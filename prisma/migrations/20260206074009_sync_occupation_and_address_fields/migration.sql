/*
  Warnings:

  - You are about to drop the column `reporterRoles` on the `PestReport` table. All the data in the column will be lost.
  - You are about to drop the column `profileRole` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PestReport" DROP COLUMN "reporterRoles",
ADD COLUMN     "occupationRoles" TEXT;

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "profileRole",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "occupationRoles" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "subDistrict" TEXT,
ADD COLUMN     "zipCode" TEXT;
