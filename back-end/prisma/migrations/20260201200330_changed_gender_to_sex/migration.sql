/*
  Warnings:

  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - Added the required column `sex` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT NOT NULL,
    "lastUsernameChangeAt" DATETIME,
    "dob" DATETIME NOT NULL,
    "sex" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "fitnessGoal" TEXT NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "trainingStyle" TEXT NOT NULL,
    "trainingFrequency" TEXT NOT NULL
);
INSERT INTO "new_User" ("createdAt", "dob", "email", "experienceLevel", "fitnessGoal", "height", "id", "lastUsernameChangeAt", "password", "trainingFrequency", "trainingStyle", "username", "weight") SELECT "createdAt", "dob", "email", "experienceLevel", "fitnessGoal", "height", "id", "lastUsernameChangeAt", "password", "trainingFrequency", "trainingStyle", "username", "weight" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
