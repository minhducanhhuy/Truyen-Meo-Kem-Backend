import { Injectable } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';

@Injectable()
export class StoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lấy các truyện có lượt đọc nhiều nhất trong NGÀY HÔM QUA (theo UTC)
   * Dữ liệu đếm từ bảng user_reading_histories.last_read_at
   */
  async getRecommendedYesterday(limit: number) {
    // Hôm qua theo UTC: 00:00:00.000 -> 23:59:59.999
    const now = new Date();
    const start = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - 1,
        0,
        0,
        0,
        0,
      ),
    );
    const end = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - 1,
        23,
        59,
        59,
        999,
      ),
    );

    // 1) Đếm lượt đọc hôm qua theo story_id
    const readCounts = await this.prisma.userReadingHistory.groupBy({
      by: ['story_id'],
      where: {
        last_read_at: {
          gte: start,
          lt: end,
        },
      },
      _count: {
        _all: true,
      },
    });

    // 2) Sắp xếp theo count và limit
    const sortedCounts = readCounts
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, limit);

    // 3) Nếu không có lượt đọc nào
    if (sortedCounts.length === 0) {
      return [];
    }

    // 4) Lấy thông tin chi tiết của các story
    const storyIds = sortedCounts.map(item => item.story_id);
    const stories = await this.prisma.story.findMany({
      where: {
        id: {
          in: storyIds,
        },
      },
      select: {
        id: true,
        name: true,
        cover_url: true,
        rate_point: true,
        rate_count: true,
        view_count: true,
        status: true,
        updated_at: true,
      },
    });

    // 5) Sắp xếp lại theo thứ tự ranking
    const storyMap = new Map(stories.map(story => [story.id, story]));
    return sortedCounts
      .map(item => storyMap.get(item.story_id))
      .filter(story => story !== undefined);
  }
}
