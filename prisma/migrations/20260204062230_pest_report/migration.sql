-- CreateTable
CREATE TABLE "PestReport" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "province" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "plant" TEXT NOT NULL,
    "pestId" TEXT NOT NULL,
    "pest" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "symptomOnSet" TIMESTAMP(3) NOT NULL,
    "filedAffectedArea" DOUBLE PRECISION NOT NULL,
    "incidencePercent" DOUBLE PRECISION NOT NULL,
    "severityPercent" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "imageUrls" TEXT[],
    "imageTitles" TEXT[],

    CONSTRAINT "PestReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PestReport_province_idx" ON "PestReport"("province");

-- CreateIndex
CREATE INDEX "PestReport_pestId_idx" ON "PestReport"("pestId");
