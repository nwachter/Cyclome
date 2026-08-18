/*
  Warnings:

  - Made the column `intervention_date` on table `intervention` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "intervention" ADD COLUMN     "intervention_completed_at" TIMESTAMP(3),
ADD COLUMN     "intervention_started_at" TIMESTAMP(3),
ALTER COLUMN "intervention_date" SET NOT NULL;
