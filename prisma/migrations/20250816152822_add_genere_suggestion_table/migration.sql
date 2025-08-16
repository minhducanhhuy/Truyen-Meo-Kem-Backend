-- CreateEnum
CREATE TYPE "public"."SuggestionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."genre_suggestions" (
    "id" UUID NOT NULL,
    "story_id" UUID NOT NULL,
    "suggested_name" VARCHAR(100) NOT NULL,
    "status" "public"."SuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "admin_comment" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "genre_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "genre_suggestions_story_id_idx" ON "public"."genre_suggestions"("story_id");

-- AddForeignKey
ALTER TABLE "public"."genre_suggestions" ADD CONSTRAINT "genre_suggestions_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
