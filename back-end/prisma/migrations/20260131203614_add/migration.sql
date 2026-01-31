-- CreateTable
CREATE TABLE "forgotPasswordOTP" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "forgotPasswordOTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "forgotPasswordOTP_userId_idx" ON "forgotPasswordOTP"("userId");

-- CreateIndex
CREATE INDEX "forgotPasswordOTP_expiresAt_idx" ON "forgotPasswordOTP"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "forgotPasswordOTP_userId_key" ON "forgotPasswordOTP"("userId");
