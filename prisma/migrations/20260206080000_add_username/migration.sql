-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "userName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userName_key" ON "UserProfile"("userName");
