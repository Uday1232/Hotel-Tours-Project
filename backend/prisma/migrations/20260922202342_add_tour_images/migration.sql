-- CreateTable
CREATE TABLE "tour_images" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tour_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tour_images_tourId_idx" ON "tour_images"("tourId");

-- CreateIndex
CREATE INDEX "tour_images_isPrimary_idx" ON "tour_images"("isPrimary");

-- AddForeignKey
ALTER TABLE "tour_images" ADD CONSTRAINT "tour_images_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tour_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
