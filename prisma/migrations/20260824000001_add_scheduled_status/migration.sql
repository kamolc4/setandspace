-- AlterEnum
-- Adding SCHEDULED value to the existing Status enum
-- This is additive and does not affect existing DRAFT or PUBLISHED records
ALTER TYPE "Status" ADD VALUE 'SCHEDULED' AFTER 'DRAFT';
