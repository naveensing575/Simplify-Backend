/*
  Warnings:

  - You are about to alter the column `status` on the `task` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.
  - You are about to alter the column `priority` on the `task` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(5))`.
  - You are about to alter the column `role` on the `teammember` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `task` ADD COLUMN `boardId` VARCHAR(191) NULL,
    ADD COLUMN `projectId` VARCHAR(191) NULL,
    MODIFY `status` ENUM('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE') NOT NULL DEFAULT 'TODO',
    MODIFY `priority` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'LOW';

-- AlterTable
ALTER TABLE `teammember` MODIFY `role` ENUM('ADMIN', 'MEMBER', 'GUEST') NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ADMIN', 'MANAGER', 'MEMBER') NOT NULL DEFAULT 'MEMBER';

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'COMPLETED', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
    `ownerId` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaskBoard` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `type` ENUM('PERSONAL', 'TEAM') NOT NULL DEFAULT 'PERSONAL',
    `userId` VARCHAR(191) NULL,
    `teamId` VARCHAR(191) NULL,
    `projectId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskBoard` ADD CONSTRAINT `TaskBoard_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskBoard` ADD CONSTRAINT `TaskBoard_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskBoard` ADD CONSTRAINT `TaskBoard_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `TaskBoard`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
