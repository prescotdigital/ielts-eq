/*
  Warnings:

  - You are about to drop the column `feedback` on the `TestSession` table. All the data in the column will be lost.
  - The `status` column on the `TestSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TestSession" DROP COLUMN "feedback",
ADD COLUMN     "analysis" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS';

-- CreateIndex
CREATE INDEX "TestSession_userId_idx" ON "TestSession"("userId");
