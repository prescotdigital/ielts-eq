-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "example" TEXT NOT NULL,
    "partOfSpeech" TEXT NOT NULL,
    "sublist" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFlashcardProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "familiarity" INTEGER NOT NULL DEFAULT 0,
    "lastReviewed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserFlashcardProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flashcard_word_key" ON "Flashcard"("word");

-- CreateIndex
CREATE INDEX "Flashcard_sublist_idx" ON "Flashcard"("sublist");

-- CreateIndex
CREATE INDEX "UserFlashcardProgress_userId_idx" ON "UserFlashcardProgress"("userId");

-- CreateIndex
CREATE INDEX "UserFlashcardProgress_familiarity_idx" ON "UserFlashcardProgress"("familiarity");

-- CreateIndex
CREATE INDEX "UserFlashcardProgress_lastReviewed_idx" ON "UserFlashcardProgress"("lastReviewed");

-- CreateIndex
CREATE UNIQUE INDEX "UserFlashcardProgress_userId_flashcardId_key" ON "UserFlashcardProgress"("userId", "flashcardId");

-- AddForeignKey
ALTER TABLE "UserFlashcardProgress" ADD CONSTRAINT "UserFlashcardProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFlashcardProgress" ADD CONSTRAINT "UserFlashcardProgress_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
