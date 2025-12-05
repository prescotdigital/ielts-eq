-- CreateTable
CREATE TABLE "BlogDraft" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "step" INTEGER NOT NULL DEFAULT 1,
    "idea" TEXT,
    "keywords" TEXT,
    "categoryId" TEXT,
    "titleOptions" JSONB,
    "selectedTitle" TEXT,
    "slug" TEXT,
    "excerptOptions" JSONB,
    "selectedExcerpt" TEXT,
    "style" TEXT,
    "length" TEXT,
    "content" TEXT,
    "featuredImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlogDraft_userId_idx" ON "BlogDraft"("userId");

-- AddForeignKey
ALTER TABLE "BlogDraft" ADD CONSTRAINT "BlogDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
