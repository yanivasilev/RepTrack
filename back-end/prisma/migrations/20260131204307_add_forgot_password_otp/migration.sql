/*
  Warnings:

  - You are about to drop the `forgotPasswordOTP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "forgotPasswordOTP";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ForgotPasswordOtp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ForgotPasswordOtp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ForgotPasswordOtp_userId_idx" ON "ForgotPasswordOtp"("userId");

-- CreateIndex
CREATE INDEX "ForgotPasswordOtp_expiresAt_idx" ON "ForgotPasswordOtp"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPasswordOtp_userId_key" ON "ForgotPasswordOtp"("userId");
