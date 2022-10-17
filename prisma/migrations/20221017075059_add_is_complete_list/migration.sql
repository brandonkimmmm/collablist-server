-- AlterTable
ALTER TABLE "lists" ADD COLUMN     "is_complete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';
