/*
  Warnings:

  - Added the required column `retiradaKit` to the `Inscricao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sexo` to the `Inscricao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inscricao" ADD COLUMN     "retiradaKit" TEXT NOT NULL,
ADD COLUMN     "sexo" TEXT NOT NULL;
