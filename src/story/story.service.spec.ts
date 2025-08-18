import { Test, TestingModule } from '@nestjs/testing';
import { StoryService } from './story.service';
import { PrismaService } from '../modules/prisma/prisma.service';

describe('StoryService', () => {
  let service: StoryService;

  // Mock PrismaService
  const mockPrisma = {
    userReadingHistory: { groupBy: jest.fn() },
    story: { findMany: jest.fn() }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoryService,
        { provide: PrismaService, useValue: mockPrisma }
      ]
    }).compile();

    service = module.get<StoryService>(StoryService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('queries yesterday (UTC) and returns ranked stories in order', async () => {
    // Cố định "now" theo UTC
    jest.useFakeTimers().setSystemTime(new Date('2025-08-17T15:30:00.000Z'));

    // groupBy trả về thứ tự s1 (5) rồi s2 (3)
    mockPrisma.userReadingHistory.groupBy.mockResolvedValue([
      { story_id: 's1', _count: { _all: 5 } },
      { story_id: 's2', _count: { _all: 3 } }
    ]);

    // findMany có thể không đúng thứ tự → cố tình đảo để kiểm tra re-order
    mockPrisma.story.findMany.mockResolvedValue([
      {
        id: 's2',
        name: 'B',
        cover_url: null,
        rate_point: 0,
        rate_count: 0,
        view_count: 0,
        status: 'UPDATING',
        updated_at: new Date()
      },
      {
        id: 's1',
        name: 'A',
        cover_url: null,
        rate_point: 0,
        rate_count: 0,
        view_count: 0,
        status: 'UPDATING',
        updated_at: new Date()
      }
    ]);

    const rows = await service.getRecommendedYesterday(10);

    // Mốc hôm qua theo UTC
    const expectedStart = new Date('2025-08-16T00:00:00.000Z');
    const expectedEnd = new Date('2025-08-16T23:59:59.999Z');

    // ⬇️ SỬA: Bỏ orderBy và take vì đã không dùng nữa
    expect(mockPrisma.userReadingHistory.groupBy).toHaveBeenCalledWith({
      by: ['story_id'],
      where: {
        last_read_at: {
          gte: expectedStart,
          lt: expectedEnd
        }
      },
      _count: { _all: true },
      // ❌ Bỏ 2 dòng này vì code thực tế không dùng
      // orderBy: { _count: { _all: 'desc' } },
      // take: 10
    });

    // Giữ đúng thứ tự ranking theo sort: s1 trước s2
    expect(rows.map(r => r.id)).toEqual(['s1', 's2']);
  });

  it('returns empty array when no reads yesterday', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-08-17T12:00:00.000Z'));
    mockPrisma.userReadingHistory.groupBy.mockResolvedValue([]);
    const rows = await service.getRecommendedYesterday(5);
    expect(rows).toEqual([]);
    expect(mockPrisma.story.findMany).not.toHaveBeenCalled();
  });

  it('respects provided limit (via slice)', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-08-17T12:00:00.000Z'));
    
    // Mock 5 items nhưng chỉ lấy 3
    mockPrisma.userReadingHistory.groupBy.mockResolvedValue([
      { story_id: 's1', _count: { _all: 9 } },
      { story_id: 's2', _count: { _all: 8 } },
      { story_id: 's3', _count: { _all: 7 } },
      { story_id: 's4', _count: { _all: 6 } },
      { story_id: 's5', _count: { _all: 5 } },
    ]);
    
    mockPrisma.story.findMany.mockResolvedValue([
      { id: 's1', name: 'A', cover_url: null, rate_point: 0, rate_count: 0, view_count: 0, status: 'UPDATING', updated_at: new Date() },
      { id: 's2', name: 'B', cover_url: null, rate_point: 0, rate_count: 0, view_count: 0, status: 'UPDATING', updated_at: new Date() },
      { id: 's3', name: 'C', cover_url: null, rate_point: 0, rate_count: 0, view_count: 0, status: 'UPDATING', updated_at: new Date() },
    ]);

    const rows = await service.getRecommendedYesterday(3);

    // ⬇️ SỬA: Không check take nữa vì groupBy không có take
    expect(rows).toHaveLength(3);
    expect(rows.map(r => r.id)).toEqual(['s1', 's2', 's3']);
  });

  it('propagates prisma errors', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-08-17T12:00:00.000Z'));
    mockPrisma.userReadingHistory.groupBy.mockRejectedValue(new Error('DB down'));
    await expect(service.getRecommendedYesterday(10)).rejects.toThrow('DB down');
  });
});
