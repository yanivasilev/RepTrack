/*
  Warnings:

  - You are about to drop the column `token` on the `ForgotPasswordOtp` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ForgotPasswordSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ForgotPasswordSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ForgotPasswordOtp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ForgotPasswordOtp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ForgotPasswordOtp" ("attempts", "createdAt", "expiresAt", "id", "otpHash", "usedAt", "userId") SELECT "attempts", "createdAt", "expiresAt", "id", "otpHash", "usedAt", "userId" FROM "ForgotPasswordOtp";
DROP TABLE "ForgotPasswordOtp";
ALTER TABLE "new_ForgotPasswordOtp" RENAME TO "ForgotPasswordOtp";
CREATE INDEX "ForgotPasswordOtp_userId_idx" ON "ForgotPasswordOtp"("userId");
CREATE INDEX "ForgotPasswordOtp_expiresAt_idx" ON "ForgotPasswordOtp"("expiresAt");
CREATE UNIQUE INDEX "ForgotPasswordOtp_userId_key" ON "ForgotPasswordOtp"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPasswordSession_tokenHash_key" ON "ForgotPasswordSession"("tokenHash");

-- CreateIndex
CREATE INDEX "ForgotPasswordSession_userId_idx" ON "ForgotPasswordSession"("userId");

-- CreateIndex
CREATE INDEX "ForgotPasswordSession_expiresAt_idx" ON "ForgotPasswordSession"("expiresAt");
