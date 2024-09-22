-- AlterTable
ALTER TABLE `team` ADD COLUMN `projectId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
