-- CreateTable
CREATE TABLE "Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'STRENGTH',
    "muscleGroup" TEXT NOT NULL DEFAULT 'OTHER',
    "equipment" TEXT NOT NULL DEFAULT 'OTHER',
    "isBodyweight" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WorkoutSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkoutSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkoutExercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    CONSTRAINT "WorkoutExercise_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkoutSet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workoutExerciseId" INTEGER NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "reps" INTEGER,
    "weight" REAL,
    "durationSeconds" INTEGER,
    "distanceMeters" REAL,
    "rpe" INTEGER,
    "isWarmup" BOOLEAN NOT NULL DEFAULT false,
    "isFailure" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkoutSet_workoutExerciseId_fkey" FOREIGN KEY ("workoutExerciseId") REFERENCES "WorkoutExercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");

-- CreateIndex
CREATE INDEX "Exercise_muscleGroup_idx" ON "Exercise"("muscleGroup");

-- CreateIndex
CREATE INDEX "Exercise_equipment_idx" ON "Exercise"("equipment");

-- CreateIndex
CREATE INDEX "WorkoutSession_userId_startedAt_idx" ON "WorkoutSession"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "WorkoutExercise_sessionId_idx" ON "WorkoutExercise"("sessionId");

-- CreateIndex
CREATE INDEX "WorkoutExercise_exerciseId_idx" ON "WorkoutExercise"("exerciseId");

-- CreateIndex
CREATE INDEX "WorkoutSet_workoutExerciseId_idx" ON "WorkoutSet"("workoutExerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutSet_workoutExerciseId_setNumber_key" ON "WorkoutSet"("workoutExerciseId", "setNumber");
