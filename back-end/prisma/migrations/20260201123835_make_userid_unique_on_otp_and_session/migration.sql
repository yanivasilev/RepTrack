/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ForgotPasswordSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ForgotPasswordSession_userId_key" ON "ForgotPasswordSession"("userId");
