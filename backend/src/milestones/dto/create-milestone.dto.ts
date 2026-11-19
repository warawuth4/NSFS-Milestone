import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MilestoneStatus } from '@prisma/client';

export class CreateMilestoneDto {
  @ApiProperty({
    example: 'Q1 2026 Core Platform Release',
    description: 'Milestone title identifying the project checkpoint',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'Deliver foundational user authentication, epic management, and sprint planning boards.',
    description: 'Detailed description and scope of the milestone',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: '2026-03-31T23:59:59.000Z',
    description: 'Target completion date for milestone',
  })
  @IsISO8601()
  @IsOptional()
  targetDate?: string;

  @ApiPropertyOptional({
    enum: MilestoneStatus,
    default: MilestoneStatus.IN_PROGRESS,
    example: MilestoneStatus.IN_PROGRESS,
    description: 'Current status of the milestone',
  })
  @IsEnum(MilestoneStatus)
  @IsOptional()
  status?: MilestoneStatus;
}
