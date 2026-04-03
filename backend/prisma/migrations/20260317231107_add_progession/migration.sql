-- CreateTable
CREATE TABLE `Progression` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `apprenantFormationId` INTEGER NOT NULL,
    `dateDerniereActivite` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Progression_apprenantFormationId_key`(`apprenantFormationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApprenantChapitre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estComplete` BOOLEAN NOT NULL DEFAULT false,
    `dateCompletion` DATETIME(3) NULL,
    `progressionId` INTEGER NOT NULL,
    `chapitreId` INTEGER NOT NULL,

    UNIQUE INDEX `ApprenantChapitre_progressionId_chapitreId_key`(`progressionId`, `chapitreId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Progression` ADD CONSTRAINT `Progression_apprenantFormationId_fkey` FOREIGN KEY (`apprenantFormationId`) REFERENCES `ApprenantFormation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprenantChapitre` ADD CONSTRAINT `ApprenantChapitre_progressionId_fkey` FOREIGN KEY (`progressionId`) REFERENCES `Progression`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprenantChapitre` ADD CONSTRAINT `ApprenantChapitre_chapitreId_fkey` FOREIGN KEY (`chapitreId`) REFERENCES `Chapitre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
