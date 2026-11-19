import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ClearCacheDto {
  @ApiPropertyOptional({
    description: 'Optional key pattern to selectively clear (e.g., "milestones:*", "tasks:*")',
    example: 'milestones:*',
    default: '*',
  })
  @IsOptional()
  @IsString()
  pattern?: string;
}
