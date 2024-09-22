/*
  Warnings:

  - You are about to drop the column `projectId` on the `team` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `team` DROP FOREIGN KEY `Team_projectId_fkey`;

-- AlterTable
ALTER TABLE `team` DROP COLUMN `projectId`;
