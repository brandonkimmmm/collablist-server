/*
  Warnings:

  - You are about to drop the column `amount` on the `list_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "list_items" DROP COLUMN "amount";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';
