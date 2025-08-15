-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'PARTNER', 'MEMBER');

-- CreateEnum
CREATE TYPE "public"."StoryStatus" AS ENUM ('COMPLETED', 'UPDATING', 'PAUSED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "avatar_url" TEXT,
    "email" VARCHAR(255) NOT NULL,
    "discord_id" VARCHAR(255),
    "role" "public"."UserRole" NOT NULL DEFAULT 'MEMBER',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."genres" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stories" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "author" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "cover_url" TEXT,
    "description" TEXT,
    "status" "public"."StoryStatus" NOT NULL DEFAULT 'UPDATING',
    "rate_point" DOUBLE PRECISION DEFAULT 0,
    "rate_count" INTEGER DEFAULT 0,
    "view_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chapters" (
    "id" UUID NOT NULL,
    "story_id" UUID NOT NULL,
    "chapter_number" DOUBLE PRECISION NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "view_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."story_genres" (
    "story_id" UUID NOT NULL,
    "genre_id" UUID NOT NULL,

    CONSTRAINT "story_genres_pkey" PRIMARY KEY ("story_id","genre_id")
);

-- CreateTable
CREATE TABLE "public"."rates" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "story_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_reading_histories" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "story_id" UUID NOT NULL,
    "chapter_id" UUID NOT NULL,
    "last_read_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_reading_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_favourites" (
    "user_id" UUID NOT NULL,
    "story_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_favourites_pkey" PRIMARY KEY ("user_id","story_id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "story_id" UUID,
    "chapter_id" UUID,
    "parent_id" UUID,
    "content" TEXT NOT NULL,
    "like_count" INTEGER DEFAULT 0,
    "is_edited" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."likes" (
    "user_id" UUID NOT NULL,
    "comment_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("user_id","comment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_discord_id_key" ON "public"."users"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "public"."genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genres_slug_key" ON "public"."genres"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "stories_slug_key" ON "public"."stories"("slug");

-- CreateIndex
CREATE INDEX "stories_user_id_idx" ON "public"."stories"("user_id");

-- CreateIndex
CREATE INDEX "stories_status_idx" ON "public"."stories"("status");

-- CreateIndex
CREATE INDEX "chapters_story_id_idx" ON "public"."chapters"("story_id");

-- CreateIndex
CREATE UNIQUE INDEX "chapters_story_id_chapter_number_key" ON "public"."chapters"("story_id", "chapter_number");

-- CreateIndex
CREATE UNIQUE INDEX "chapters_story_id_slug_key" ON "public"."chapters"("story_id", "slug");

-- CreateIndex
CREATE INDEX "rates_story_id_idx" ON "public"."rates"("story_id");

-- CreateIndex
CREATE UNIQUE INDEX "rates_user_id_story_id_key" ON "public"."rates"("user_id", "story_id");

-- CreateIndex
CREATE INDEX "user_reading_histories_user_id_idx" ON "public"."user_reading_histories"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_reading_histories_user_id_story_id_key" ON "public"."user_reading_histories"("user_id", "story_id");

-- CreateIndex
CREATE INDEX "comments_story_id_idx" ON "public"."comments"("story_id");

-- CreateIndex
CREATE INDEX "comments_chapter_id_idx" ON "public"."comments"("chapter_id");

-- CreateIndex
CREATE INDEX "comments_user_id_idx" ON "public"."comments"("user_id");

-- CreateIndex
CREATE INDEX "comments_parent_id_idx" ON "public"."comments"("parent_id");

-- AddForeignKey
ALTER TABLE "public"."stories" ADD CONSTRAINT "stories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chapters" ADD CONSTRAINT "chapters_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."story_genres" ADD CONSTRAINT "story_genres_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."story_genres" ADD CONSTRAINT "story_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rates" ADD CONSTRAINT "rates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rates" ADD CONSTRAINT "rates_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_reading_histories" ADD CONSTRAINT "user_reading_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_reading_histories" ADD CONSTRAINT "user_reading_histories_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_reading_histories" ADD CONSTRAINT "user_reading_histories_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_favourites" ADD CONSTRAINT "user_favourites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_favourites" ADD CONSTRAINT "user_favourites_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
