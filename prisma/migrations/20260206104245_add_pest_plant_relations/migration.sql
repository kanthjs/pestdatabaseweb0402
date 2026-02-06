/*
  Warnings:

  - Made the column `userName` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "userName" SET NOT NULL;

-- CreateIndex
CREATE INDEX "PestReport_plantId_idx" ON "PestReport"("plantId");

-- AddForeignKey
ALTER TABLE "PestReport" ADD CONSTRAINT "PestReport_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("plantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PestReport" ADD CONSTRAINT "PestReport_pestId_fkey" FOREIGN KEY ("pestId") REFERENCES "Pest"("pestId") ON DELETE RESTRICT ON UPDATE CASCADE;
