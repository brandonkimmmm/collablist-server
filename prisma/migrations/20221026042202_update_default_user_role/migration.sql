-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL COLLATE NOCASE,
    "username" TEXT NOT NULL COLLATE NOCASE,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "first_name" TEXT NOT NULL COLLATE NOCASE,
    "password" TEXT NOT NULL,
    "last_name" TEXT NOT NULL COLLATE NOCASE,
    "avatar_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_users" ("avatar_url", "created_at", "email", "first_name", "id", "last_name", "password", "role", "updated_at", "username") SELECT "avatar_url", "created_at", "email", "first_name", "id", "last_name", "password", "role", "updated_at", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
