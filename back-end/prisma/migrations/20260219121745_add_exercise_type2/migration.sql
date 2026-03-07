/*
  Warnings:

  - You are about to drop the column `exerciseType` on the `WorkoutExercise` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'STRENGTH',
    "muscleGroup" TEXT NOT NULL DEFAULT 'OTHER',
    "equipment" TEXT NOT NULL DEFAULT 'OTHER',
    "isBodyweight" BOOLEAN NOT NULL DEFAULT false,
    "experienceLevel" TEXT NOT NULL DEFAULT 'BEGINNER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exerciseType" TEXT NOT NULL DEFAULT 'REPS'
);
INSERT INTO "new_Exercise" ("category", "createdAt", "equipment", "experienceLevel", "id", "isBodyweight", "muscleGroup", "name") SELECT "category", "createdAt", "equipment", "experienceLevel", "id", "isBodyweight", "muscleGroup", "name" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");
CREATE INDEX "Exercise_muscleGroup_idx" ON "Exercise"("muscleGroup");
CREATE INDEX "Exercise_equipment_idx" ON "Exercise"("equipment");
CREATE TABLE "new_WorkoutExercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    CONSTRAINT "WorkoutExercise_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WorkoutExercise" ("exerciseId", "id", "notes", "orderIndex", "sessionId") SELECT "exerciseId", "id", "notes", "orderIndex", "sessionId" FROM "WorkoutExercise";
DROP TABLE "WorkoutExercise";
ALTER TABLE "new_WorkoutExercise" RENAME TO "WorkoutExercise";
CREATE INDEX "WorkoutExercise_sessionId_idx" ON "WorkoutExercise"("sessionId");
CREATE INDEX "WorkoutExercise_exerciseId_idx" ON "WorkoutExercise"("exerciseId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
