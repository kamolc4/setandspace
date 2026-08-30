-- CreateEnum
CREATE TYPE "GmailStatus" AS ENUM ('PENDING', 'CONNECTED', 'ERROR');

-- CreateTable
CREATE TABLE "GmailIntegration" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "encryptedPassword" TEXT NOT NULL,
    "notifyEmail" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "status" "GmailStatus" NOT NULL DEFAULT 'PENDING',
    "lastTestAt" TIMESTAMP(3),
    "lastSuccessAt" TIMESTAMP(3),
    "lastErrorAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GmailIntegration_pkey" PRIMARY KEY ("id")
);
