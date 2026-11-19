import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { SprintStatus } from '@prisma/client';

export class CreateSprintDto {
  @ApiProperty({
    example: 'Sprint 1 - Foundation & Auth',
    description: 'Name of the sprint iteration',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Complete core milestone setup, user story drafting, and 2-click task progress flow.',
    description: 'Primary objective / goal of this sprint',
  })
  @IsString()
  @IsOptional()
  goal?: string;

  @ApiPropertyOptional({
    example: '2026-02-01T00:00:00.000Z',
    description: 'Sprint start date',
  })
  @IsISO8601()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-02-14T23:59:59.000Z',
    description: 'Sprint end date',
  })
  @IsISO8601()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    enum: SprintStatus,
    default: SprintStatus.PLANNED,
    example: SprintStatus.PLANNED,
    description: 'Sprint execution status (PLANNED, ACTIVE, COMPLETED)',
  })
  @IsEnum(SprintStatus)
  @IsOptional()
  status?: SprintStatus;

  @ApiPropertyOptional({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'Associated Milestone UUID',
  })
  @IsString()
  @IsOptional()
  milestoneId?: string;
}
