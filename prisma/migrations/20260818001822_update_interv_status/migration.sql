/*
  Warnings:

  - Changed the type of `intervention_status` on the `intervention` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "intervention_status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "intervention" DROP COLUMN "intervention_status",
ADD COLUMN     "intervention_status" "intervention_status" NOT NULL;

-- CreateIndex
CREATE INDEX "intervention_intervention_date_intervention_status_idx" ON "intervention"("intervention_date", "intervention_status");
