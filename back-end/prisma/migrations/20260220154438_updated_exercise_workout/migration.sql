/*
  Warnings:

  - You are about to drop the column `createdAt` on the `WorkoutSession` table. All the data in the column will be lost.
  - You are about to drop the column `distanceMeters` on the `WorkoutSet` table. All the data in the column will be lost.
  - You are about to drop the column `isFailure` on the `WorkoutSet` table. All the data in the column will be lost.
  - You are about to drop the column `rpe` on the `WorkoutSet` table. All the data in the column will be lost.
  - Added the required column `duration` to the `WorkoutSession` table without a default value. This is not possible if the table is not empty.
  - Made the column `endedAt` on table `WorkoutSession` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorkoutSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "endedAt" DATETIME NOT NULL,
    "notes" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkoutSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WorkoutSession" ("endedAt", "id", "notes", "startedAt", "updatedAt", "userId") SELECT "endedAt", "id", "notes", "startedAt", "updatedAt", "userId" FROM "WorkoutSession";
DROP TABLE "WorkoutSession";
ALTER TABLE "new_WorkoutSession" RENAME TO "WorkoutSession";
CREATE INDEX "WorkoutSession_userId_startedAt_idx" ON "WorkoutSession"("userId", "startedAt");
CREATE TABLE "new_WorkoutSet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workoutExerciseId" INTEGER NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "reps" INTEGER,
    "weight" REAL,
    "durationSeconds" INTEGER,
    "isWarmup" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkoutSet_workoutExerciseId_fkey" FOREIGN KEY ("workoutExerciseId") REFERENCES "WorkoutExercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WorkoutSet" ("createdAt", "durationSeconds", "id", "isWarmup", "reps", "setNumber", "weight", "workoutExerciseId") SELECT "createdAt", "durationSeconds", "id", "isWarmup", "reps", "setNumber", "weight", "workoutExerciseId" FROM "WorkoutSet";
DROP TABLE "WorkoutSet";
ALTER TABLE "new_WorkoutSet" RENAME TO "WorkoutSet";
CREATE INDEX "WorkoutSet_workoutExerciseId_idx" ON "WorkoutSet"("workoutExerciseId");
CREATE UNIQUE INDEX "WorkoutSet_workoutExerciseId_setNumber_key" ON "WorkoutSet"("workoutExerciseId", "setNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
