-- AlterTable
ALTER TABLE "session" ALTER COLUMN "userAgent" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "user_" ALTER COLUMN "user_role" SET DEFAULT 'CLIENT',
ALTER COLUMN "user_status" SET DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "account_id_user_idx" ON "account"("id_user");

-- CreateIndex
CREATE INDEX "session_id_user_idx" ON "session"("id_user");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");
