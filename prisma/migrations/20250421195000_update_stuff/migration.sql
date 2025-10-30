-- Convert the existing enum based condition column into text
ALTER TABLE "Stuff"
  ALTER COLUMN "condition" DROP DEFAULT,
  ALTER COLUMN "condition" TYPE TEXT USING "condition"::text;

-- Drop the underlying enum type now that the column uses text
DROP TYPE IF EXISTS "Condition";

-- Add the new timestamp column with a default so existing rows get a value
ALTER TABLE "Stuff"
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
