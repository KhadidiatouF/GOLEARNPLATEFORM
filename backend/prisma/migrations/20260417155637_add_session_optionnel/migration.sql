-- DropForeignKey
ALTER TABLE `Quiz` DROP FOREIGN KEY `Quiz_sessionId_fkey`;

-- AlterTable
ALTER TABLE `Quiz` MODIFY `sessionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Session`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
