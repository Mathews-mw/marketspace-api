/*
  Warnings:

  - You are about to drop the column `title` on the `product_images` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[unique_name]` on the table `product_images` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_name` to the `product_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unique_name` to the `product_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_images" DROP COLUMN "title",
ADD COLUMN     "file_name" TEXT NOT NULL,
ADD COLUMN     "unique_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_images_unique_name_key" ON "product_images"("unique_name");
