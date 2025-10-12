/*
  Warnings:

  - You are about to drop the column `categoriaId` on the `Inscricao` table. All the data in the column will be lost.
  - You are about to drop the column `kitId` on the `Inscricao` table. All the data in the column will be lost.
  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Kit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Inscricao" DROP CONSTRAINT "Inscricao_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inscricao" DROP CONSTRAINT "Inscricao_kitId_fkey";

-- AlterTable
ALTER TABLE "Inscricao" DROP COLUMN "categoriaId",
DROP COLUMN "kitId",
ADD COLUMN     "categoria" TEXT;

-- DropTable
DROP TABLE "public"."Categoria";

-- DropTable
DROP TABLE "public"."Kit";
