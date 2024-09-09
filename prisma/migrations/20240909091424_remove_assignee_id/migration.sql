/*
  Warnings:

  - You are about to drop the column `assigneeId` on the `task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_assigneeId_fkey`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `assigneeId`,
    ADD COLUMN `assigneeid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'member';

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_assigneeid_fkey` FOREIGN KEY (`assigneeid`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
