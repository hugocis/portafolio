-- CreateTable
CREATE TABLE "Blob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blob_key_key" ON "Blob"("key");

-- CreateIndex
CREATE INDEX "Blob_userId_idx" ON "Blob"("userId");

-- CreateIndex
CREATE INDEX "Blob_category_idx" ON "Blob"("category");

-- AddForeignKey
ALTER TABLE "Blob" ADD CONSTRAINT "Blob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
