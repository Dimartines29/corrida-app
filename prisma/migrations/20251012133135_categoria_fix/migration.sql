/*
  Warnings:

  - Made the column `categoria` on table `Inscricao` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Inscricao" ALTER COLUMN "categoria" SET NOT NULL;
