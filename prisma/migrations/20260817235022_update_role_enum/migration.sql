/*
  Warnings:

  - The values [client,admin,technician] on the enum `user_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "user_role_new" AS ENUM ('CLIENT', 'ADMIN', 'TECHNICIAN');
ALTER TABLE "user_" ALTER COLUMN "user_role" TYPE "user_role_new" USING ("user_role"::text::"user_role_new");
ALTER TYPE "user_role" RENAME TO "user_role_old";
ALTER TYPE "user_role_new" RENAME TO "user_role";
DROP TYPE "public"."user_role_old";
COMMIT;
