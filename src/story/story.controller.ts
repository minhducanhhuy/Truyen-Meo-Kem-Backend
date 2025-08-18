import {
  Controller,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { StoryService } from './story.service';

@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  // GET /stories/recommended?limit=10
  @Get('recommended')
  async getRecommended(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const take = Math.min(Math.max(limit, 1), 50);
    const data = await this.storyService.getRecommendedYesterday(take);
    return { data };
  }
}
