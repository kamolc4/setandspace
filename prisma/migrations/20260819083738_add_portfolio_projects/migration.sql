-- CreateEnum
CREATE TYPE "AspectRatio" AS ENUM ('PORTRAIT', 'LANDSCAPE', 'SQUARE');

-- CreateTable
CREATE TABLE "PortfolioProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "category" TEXT NOT NULL DEFAULT '',
    "location" TEXT,
    "clientName" TEXT,
    "videoUrl" TEXT,
    "videoProvider" TEXT,
    "videoId" TEXT,
    "videoAspectRatio" "AspectRatio" NOT NULL DEFAULT 'PORTRAIT',
    "posterImage" TEXT,
    "posterAlt" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonical" TEXT,

    CONSTRAINT "PortfolioProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioProject_slug_key" ON "PortfolioProject"("slug");
