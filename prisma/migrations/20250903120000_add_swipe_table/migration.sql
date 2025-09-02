-- Drop unused seasonal tables
DROP TABLE IF EXISTS "public"."SeasonLike";
DROP TABLE IF EXISTS "public"."Season";

-- CreateTable
CREATE TABLE "public"."Swipe" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coinId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Swipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Swipe_coinId_idx" ON "public"."Swipe"("coinId");
CREATE INDEX "Swipe_userId_idx" ON "public"."Swipe"("userId");

-- AddForeignKey
ALTER TABLE "public"."Swipe" ADD CONSTRAINT "Swipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
