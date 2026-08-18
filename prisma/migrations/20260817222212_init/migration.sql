-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('client', 'admin', 'technician');

-- CreateEnum
CREATE TYPE "cycle_type" AS ENUM ('MECHANICAL', 'ELECTRICAL');

-- CreateEnum
CREATE TYPE "picture_stage" AS ENUM ('AT_BOOKING', 'BEFORE_WORK', 'AFTER_WORK');

-- CreateTable
CREATE TABLE "user_" (
    "user_id" VARCHAR(50) NOT NULL,
    "user_email" VARCHAR(300) NOT NULL,
    "user_name" VARCHAR(300) NOT NULL,
    "user_role" "user_role",
    "user_image_url" VARCHAR(150),
    "user_status" VARCHAR(20) NOT NULL,
    "user_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "user_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user__pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" VARCHAR(50) NOT NULL,
    "id_user" VARCHAR(50) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" VARCHAR(45),
    "userAgent" VARCHAR(300),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" VARCHAR(50) NOT NULL,
    "id_user" VARCHAR(50) NOT NULL,
    "accountId" VARCHAR(255) NOT NULL,
    "providerId" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255),
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "idToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" VARCHAR(50) NOT NULL,
    "identifier" VARCHAR(300) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "client_id" SERIAL NOT NULL,
    "client_lastname" VARCHAR(30) NOT NULL,
    "client_firstname" VARCHAR(30) NOT NULL,
    "client_address" VARCHAR(100) NOT NULL,
    "client_phone" VARCHAR(15),
    "client_postal_code" VARCHAR(10) NOT NULL,
    "client_city" VARCHAR(30) NOT NULL,
    "client_location" JSONB,
    "id_user" VARCHAR(50) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("client_id")
);

-- CreateTable
CREATE TABLE "technician" (
    "technician_id" SMALLSERIAL NOT NULL,
    "technician_phone" VARCHAR(15),
    "technician_location" JSONB,
    "id_user" VARCHAR(50) NOT NULL,

    CONSTRAINT "technician_pkey" PRIMARY KEY ("technician_id")
);

-- CreateTable
CREATE TABLE "cycle_" (
    "cycle_id" SERIAL NOT NULL,
    "cycle_type" "cycle_type" NOT NULL,
    "cycle_category" VARCHAR(30),
    "cycle_brand" VARCHAR(50) NOT NULL,
    "cycle_model" VARCHAR(50) NOT NULL,
    "cycle_year" SMALLINT NOT NULL,
    "cycle_motorisation" VARCHAR(60),
    "cycle_status" VARCHAR(15) NOT NULL,
    "id_client" INTEGER NOT NULL,

    CONSTRAINT "cycle__pkey" PRIMARY KEY ("cycle_id")
);

-- CreateTable
CREATE TABLE "operation_type" (
    "operation_type_id" SERIAL NOT NULL,
    "operation_type_name" VARCHAR(50) NOT NULL,
    "operation_type_description" VARCHAR(500),

    CONSTRAINT "operation_type_pkey" PRIMARY KEY ("operation_type_id")
);

-- CreateTable
CREATE TABLE "package" (
    "package_id" SERIAL NOT NULL,
    "package_name" VARCHAR(100),
    "package_duration" INTEGER NOT NULL,
    "package_price" DECIMAL(10,2) NOT NULL,
    "package_description" TEXT,
    "package_active" BOOLEAN NOT NULL DEFAULT true,
    "id_operation_type" INTEGER NOT NULL,

    CONSTRAINT "package_pkey" PRIMARY KEY ("package_id")
);

-- CreateTable
CREATE TABLE "product" (
    "product_id" SERIAL NOT NULL,
    "product_name" VARCHAR(100),
    "product_reference" VARCHAR(30) NOT NULL,
    "product_price" DECIMAL(10,2) NOT NULL,
    "product_description" VARCHAR(1000),
    "product_status" VARCHAR(15) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "zone" (
    "zone_id" SERIAL NOT NULL,
    "zone_name" VARCHAR(30) NOT NULL,
    "zone_boundary" JSONB NOT NULL,
    "zone_description" VARCHAR(500),
    "zone_color" VARCHAR(20),
    "zone_active" BOOLEAN NOT NULL DEFAULT true,
    "id_technician" SMALLINT,

    CONSTRAINT "zone_pkey" PRIMARY KEY ("zone_id")
);

-- CreateTable
CREATE TABLE "availability" (
    "availability_id" SERIAL NOT NULL,
    "availability_start_date" TIMESTAMP(3) NOT NULL,
    "availability_end_date" TIMESTAMP(3) NOT NULL,
    "id_zone" INTEGER NOT NULL,

    CONSTRAINT "availability_pkey" PRIMARY KEY ("availability_id")
);

-- CreateTable
CREATE TABLE "slot" (
    "slot_id" SERIAL NOT NULL,
    "slot_start_date" TIMESTAMP(3) NOT NULL,
    "slot_end_date" TIMESTAMP(3) NOT NULL,
    "slot_booked" BOOLEAN NOT NULL DEFAULT false,
    "id_availability" INTEGER NOT NULL,

    CONSTRAINT "slot_pkey" PRIMARY KEY ("slot_id")
);

-- CreateTable
CREATE TABLE "intervention" (
    "intervention_id" SERIAL NOT NULL,
    "intervention_description" VARCHAR(1000) NOT NULL,
    "intervention_address" VARCHAR(150) NOT NULL,
    "intervention_address_complement" VARCHAR(150),
    "intervention_postal_code" VARCHAR(15) NOT NULL,
    "intervention_city" VARCHAR(30) NOT NULL,
    "intervention_location" JSONB NOT NULL,
    "intervention_total_price" DECIMAL(10,2) NOT NULL,
    "intervention_date" TIMESTAMP(3),
    "intervention_duration" INTEGER NOT NULL,
    "intervention_status" VARCHAR(20) NOT NULL,
    "intervention_cancelled_at" TIMESTAMP(3),
    "intervention_cancellation_reason" VARCHAR(1000),
    "intervention_technician_comment" TEXT,
    "id_cancelled_by" VARCHAR(50),
    "id_cycle" INTEGER NOT NULL,
    "id_package" INTEGER NOT NULL,
    "id_slot" INTEGER NOT NULL,
    "id_technician" SMALLINT NOT NULL,
    "id_client" INTEGER NOT NULL,

    CONSTRAINT "intervention_pkey" PRIMARY KEY ("intervention_id")
);

-- CreateTable
CREATE TABLE "picture" (
    "picture_id" SERIAL NOT NULL,
    "picture_url" VARCHAR(150) NOT NULL,
    "picture_mime_type" VARCHAR(30) NOT NULL,
    "picture_stage" "picture_stage" NOT NULL,
    "picture_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_user" VARCHAR(50) NOT NULL,
    "id_intervention" INTEGER NOT NULL,

    CONSTRAINT "picture_pkey" PRIMARY KEY ("picture_id")
);

-- CreateTable
CREATE TABLE "contain" (
    "id_intervention" INTEGER NOT NULL,
    "id_product" INTEGER NOT NULL,
    "quantity" SMALLINT NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "contain_pkey" PRIMARY KEY ("id_intervention","id_product")
);

-- CreateTable
CREATE TABLE "society" (
    "society_id" SERIAL NOT NULL,
    "society_name" VARCHAR(50) NOT NULL,
    "society_phone" VARCHAR(15) NOT NULL,
    "society_description" VARCHAR(1000),
    "society_logo_url" VARCHAR(500),
    "society_address" VARCHAR(200) NOT NULL,

    CONSTRAINT "society_pkey" PRIMARY KEY ("society_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user__user_email_key" ON "user_"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "client_id_user_key" ON "client"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "technician_id_user_key" ON "technician"("id_user");

-- CreateIndex
CREATE INDEX "cycle__id_client_idx" ON "cycle_"("id_client");

-- CreateIndex
CREATE INDEX "package_id_operation_type_idx" ON "package"("id_operation_type");

-- CreateIndex
CREATE UNIQUE INDEX "product_product_reference_key" ON "product"("product_reference");

-- CreateIndex
CREATE INDEX "zone_id_technician_idx" ON "zone"("id_technician");

-- CreateIndex
CREATE INDEX "availability_id_zone_availability_start_date_idx" ON "availability"("id_zone", "availability_start_date");

-- CreateIndex
CREATE INDEX "slot_slot_start_date_slot_booked_idx" ON "slot"("slot_start_date", "slot_booked");

-- CreateIndex
CREATE UNIQUE INDEX "slot_id_availability_slot_start_date_key" ON "slot"("id_availability", "slot_start_date");

-- CreateIndex
CREATE UNIQUE INDEX "intervention_id_slot_key" ON "intervention"("id_slot");

-- CreateIndex
CREATE INDEX "intervention_intervention_date_intervention_status_idx" ON "intervention"("intervention_date", "intervention_status");

-- CreateIndex
CREATE INDEX "intervention_id_technician_intervention_date_idx" ON "intervention"("id_technician", "intervention_date");

-- CreateIndex
CREATE INDEX "intervention_id_client_idx" ON "intervention"("id_client");

-- CreateIndex
CREATE INDEX "picture_id_intervention_picture_stage_idx" ON "picture"("id_intervention", "picture_stage");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user_"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user_"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user_"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technician" ADD CONSTRAINT "technician_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user_"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycle_" ADD CONSTRAINT "cycle__id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "client"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package" ADD CONSTRAINT "package_id_operation_type_fkey" FOREIGN KEY ("id_operation_type") REFERENCES "operation_type"("operation_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zone" ADD CONSTRAINT "zone_id_technician_fkey" FOREIGN KEY ("id_technician") REFERENCES "technician"("technician_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability" ADD CONSTRAINT "availability_id_zone_fkey" FOREIGN KEY ("id_zone") REFERENCES "zone"("zone_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot" ADD CONSTRAINT "slot_id_availability_fkey" FOREIGN KEY ("id_availability") REFERENCES "availability"("availability_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_id_cancelled_by_fkey" FOREIGN KEY ("id_cancelled_by") REFERENCES "user_"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_id_cycle_fkey" FOREIGN KEY ("id_cycle") REFERENCES "cycle_"("cycle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_id_package_fkey" FOREIGN KEY ("id_package") REFERENCES "package"("package_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_id_slot_fkey" FOREIGN KEY ("id_slot") REFERENCES "slot"("slot_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_id_technician_fkey" FOREIGN KEY ("id_technician") REFERENCES "technician"("technician_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "client"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "picture" ADD CONSTRAINT "picture_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user_"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "picture" ADD CONSTRAINT "picture_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "intervention"("intervention_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contain" ADD CONSTRAINT "contain_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "intervention"("intervention_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contain" ADD CONSTRAINT "contain_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
