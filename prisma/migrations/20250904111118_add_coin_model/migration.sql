-- CreateTable
CREATE TABLE "public"."Coin" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,

    CONSTRAINT "Coin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Swipe" ADD CONSTRAINT "Swipe_coinId_fkey" FOREIGN KEY ("coinId") REFERENCES "public"."Coin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
