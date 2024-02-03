/*
  Warnings:

  - You are about to drop the column `level` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the `_RoleToRoute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_RoleToRoute` DROP FOREIGN KEY `_RoleToRoute_A_fkey`;

-- DropForeignKey
ALTER TABLE `_RoleToRoute` DROP FOREIGN KEY `_RoleToRoute_B_fkey`;

-- AlterTable
ALTER TABLE `Route` DROP COLUMN `level`;

-- DropTable
DROP TABLE `_RoleToRoute`;

-- CreateTable
CREATE TABLE `RoleRoute` (
    `roleId` INTEGER NOT NULL,
    `routeId` INTEGER NOT NULL,
    `level` INTEGER NOT NULL,

    PRIMARY KEY (`roleId`, `routeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RoleRoute` ADD CONSTRAINT `RoleRoute_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleRoute` ADD CONSTRAINT `RoleRoute_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
