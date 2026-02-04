-- CreateTable
CREATE TABLE "Province" (
    "provinceId" INTEGER NOT NULL,
    "provinceName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Plant" (
    "plantId" TEXT NOT NULL,
    "plantName" TEXT NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("plantId")
);

-- CreateTable
CREATE TABLE "Pest" (
    "pestId" TEXT NOT NULL,
    "pestName" TEXT NOT NULL,

    CONSTRAINT "Pest_pkey" PRIMARY KEY ("pestId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Province_provinceName_key" ON "Province"("provinceName");
