import { Test, TestingModule } from '@nestjs/testing';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { StoryStatus } from '@prisma/client';

describe('StoryController', () => {
  let controller: StoryController;

  const mockStoryService = {
    getRecommendedYesterday: jest.fn(),
  };

  const mockStories = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Story 1',
      cover_url: 'https://example.com/cover1.jpg',
      rate_point: 4.5,
      rate_count: 100,
      view_count: 1000,
      status: StoryStatus.UPDATING,
      updated_at: new Date('2025-08-16T10:00:00Z'),
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Test Story 2',
      cover_url: 'https://example.com/cover2.jpg',
      rate_point: 4.0,
      rate_count: 50,
      view_count: 500,
      status: StoryStatus.COMPLETED,
      updated_at: new Date('2025-08-16T09:00:00Z'),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoryController],
      providers: [{ provide: StoryService, useValue: mockStoryService }],
    }).compile();

    controller = module.get<StoryController>(StoryController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('wraps result as { data } and clamps min to 1', async () => {
    mockStoryService.getRecommendedYesterday.mockResolvedValue(mockStories);
    const res = await controller.getRecommended(0);
    expect(res).toEqual({ data: mockStories });
    expect(mockStoryService.getRecommendedYesterday).toHaveBeenCalledWith(1);
  });

  it('passes custom limit within range', async () => {
    mockStoryService.getRecommendedYesterday.mockResolvedValue(mockStories.slice(0, 1));
    const res = await controller.getRecommended(25);
    expect(res).toEqual({ data: mockStories.slice(0, 1) });
    expect(mockStoryService.getRecommendedYesterday).toHaveBeenCalledWith(25);
  });

  it('clamps max to 50', async () => {
    mockStoryService.getRecommendedYesterday.mockResolvedValue([]);
    await controller.getRecommended(99);
    expect(mockStoryService.getRecommendedYesterday).toHaveBeenCalledWith(50);
  });

  it('bubbles up errors from service', async () => {
    mockStoryService.getRecommendedYesterday.mockRejectedValue(new Error('DB failed'));
    await expect(controller.getRecommended(10)).rejects.toThrow('DB failed');
  });
});
