-- DropForeignKey
ALTER TABLE "PestReport" DROP CONSTRAINT "PestReport_provinceCode_fkey";

-- AlterTable
ALTER TABLE "PestReport" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "plantStage" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "PlantGrowthStage" (
    "stageId" TEXT NOT NULL,
    "stageNameEn" TEXT NOT NULL,
    "stageNameTh" TEXT,
    "notes" TEXT,

    CONSTRAINT "PlantGrowthStage_pkey" PRIMARY KEY ("stageId")
);

-- AddForeignKey
ALTER TABLE "PestReport" ADD CONSTRAINT "PestReport_provinceCode_fkey" FOREIGN KEY ("provinceCode") REFERENCES "Province"("provinceCode") ON DELETE RESTRICT ON UPDATE CASCADE;
