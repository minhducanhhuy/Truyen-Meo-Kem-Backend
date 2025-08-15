-- CreateTable
CREATE TABLE "public"."story_top_weeks" (
    "id" UUID NOT NULL,
    "story_id" UUID NOT NULL,
    "week_start" TIMESTAMP(3) NOT NULL,
    "view_count" INTEGER NOT NULL,

    CONSTRAINT "story_top_weeks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "story_top_weeks_story_id_idx" ON "public"."story_top_weeks"("story_id");

-- AddForeignKey
ALTER TABLE "public"."story_top_weeks" ADD CONSTRAINT "story_top_weeks_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
