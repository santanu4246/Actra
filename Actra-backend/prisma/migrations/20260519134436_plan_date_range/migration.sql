-- AlterTable: add with default first, then remove default to match schema
ALTER TABLE "OnboardingProfile"
  ADD COLUMN "planStartDate" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  ADD COLUMN "planEndDate"   TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '28 days';

ALTER TABLE "OnboardingProfile"
  ALTER COLUMN "planStartDate" DROP DEFAULT,
  ALTER COLUMN "planEndDate"   DROP DEFAULT;
