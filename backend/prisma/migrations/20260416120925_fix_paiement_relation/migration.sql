/*
  Warnings:

  - You are about to drop the column `apprenantId` on the `Paiement` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `Paiement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reference]` on the table `Paiement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apprenantFormationId` to the `Paiement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Paiement` DROP FOREIGN KEY `Paiement_apprenantId_fkey`;

-- DropIndex
DROP INDEX `Paiement_apprenantId_fkey` ON `Paiement`;

-- AlterTable
ALTER TABLE `Paiement` DROP COLUMN `apprenantId`,
    ADD COLUMN `apprenantFormationId` INTEGER NOT NULL,
    ADD COLUMN `callbackData` JSON NULL,
    ADD COLUMN `reference` VARCHAR(191) NULL,
    ADD COLUMN `statut` ENUM('EN_ATTENTE', 'VALIDE', 'ECHOUE', 'ANNULE') NOT NULL DEFAULT 'EN_ATTENTE',
    ADD COLUMN `transactionId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Paiement_transactionId_key` ON `Paiement`(`transactionId`);

-- CreateIndex
CREATE UNIQUE INDEX `Paiement_reference_key` ON `Paiement`(`reference`);

-- CreateIndex
CREATE INDEX `Paiement_apprenantFormationId_fkey` ON `Paiement`(`apprenantFormationId`);

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_apprenantFormationId_fkey` FOREIGN KEY (`apprenantFormationId`) REFERENCES `ApprenantFormation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
