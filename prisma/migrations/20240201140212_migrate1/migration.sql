/*
  Warnings:

  - You are about to drop the column `level` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Role` DROP COLUMN `level`;

-- AlterTable
ALTER TABLE `Route` ADD COLUMN `level` INTEGER NULL;
