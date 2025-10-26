/*
  Warnings:

  - Changed the type of `codigo` on the `Inscricao` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Inscricao" DROP COLUMN "codigo",
ADD COLUMN     "codigo" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_codigo_key" ON "Inscricao"("codigo");
