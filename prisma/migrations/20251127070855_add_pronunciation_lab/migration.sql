-- CreateTable
CREATE TABLE "PronunciationDrill" (
    "id" TEXT NOT NULL,
    "phoneme" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mouthImageUrl" TEXT,
    "words" TEXT[],
    "sentences" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PronunciationDrill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPronunciationProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "drillId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserPronunciationProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPronunciationProgress_userId_drillId_key" ON "UserPronunciationProgress"("userId", "drillId");

-- AddForeignKey
ALTER TABLE "UserPronunciationProgress" ADD CONSTRAINT "UserPronunciationProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPronunciationProgress" ADD CONSTRAINT "UserPronunciationProgress_drillId_fkey" FOREIGN KEY ("drillId") REFERENCES "PronunciationDrill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
