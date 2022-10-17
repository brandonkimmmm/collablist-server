-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_url" VARCHAR(255),
ALTER COLUMN "role" SET DEFAULT 'user';
