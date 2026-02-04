/*
  Warnings:

  - You are about to drop the column `pestName` on the `Pest` table. All the data in the column will be lost.
  - You are about to drop the column `pest` on the `PestReport` table. All the data in the column will be lost.
  - You are about to drop the column `plant` on the `PestReport` table. All the data in the column will be lost.
  - You are about to drop the column `plantName` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `provinceName` on the `Province` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provinceNameEn]` on the table `Province` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pestNameEn` to the `Pest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantNameEn` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinceNameEn` to the `Province` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Province_provinceName_key";

-- AlterTable
ALTER TABLE "Pest" DROP COLUMN "pestName",
ADD COLUMN     "pestNameEn" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PestReport" DROP COLUMN "pest",
DROP COLUMN "plant";

-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "plantName",
ADD COLUMN     "plantNameEn" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Province" DROP COLUMN "provinceName",
ADD COLUMN     "provinceNameEn" TEXT NOT NULL,
ADD CONSTRAINT "Province_pkey" PRIMARY KEY ("provinceId");

-- CreateIndex
CREATE UNIQUE INDEX "Province_provinceNameEn_key" ON "Province"("provinceNameEn");
