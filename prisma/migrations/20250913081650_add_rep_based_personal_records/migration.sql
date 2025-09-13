-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_personal_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "recordType" TEXT NOT NULL DEFAULT 'weight',
    "oneRepMax" REAL,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "maxReps" INTEGER,
    "dateSet" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "personal_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "personal_records_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_personal_records" ("createdAt", "dateSet", "exerciseId", "id", "notes", "oneRepMax", "unit", "updatedAt", "userId") SELECT "createdAt", "dateSet", "exerciseId", "id", "notes", "oneRepMax", "unit", "updatedAt", "userId" FROM "personal_records";
DROP TABLE "personal_records";
ALTER TABLE "new_personal_records" RENAME TO "personal_records";
CREATE UNIQUE INDEX "personal_records_userId_exerciseId_key" ON "personal_records"("userId", "exerciseId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
