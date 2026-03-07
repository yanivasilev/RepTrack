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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Exercise" ("category", "createdAt", "equipment", "id", "isBodyweight", "muscleGroup", "name") SELECT "category", "createdAt", "equipment", "id", "isBodyweight", "muscleGroup", "name" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");
CREATE INDEX "Exercise_muscleGroup_idx" ON "Exercise"("muscleGroup");
CREATE INDEX "Exercise_equipment_idx" ON "Exercise"("equipment");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
