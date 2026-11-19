import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status, Priority } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Setup Supabase OAuth credentials & redirect URIs',
    description: 'Title of the task',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'fullstack engineer',
    description: "Template field: 'As a [role]'",
  })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({
    example: 'configure OAuth client IDs and secret callbacks in Supabase dashboard',
    description: "Template field: 'I want to [action/goal]'",
  })
  @IsString()
  @IsOptional()
  want?: string;

  @ApiPropertyOptional({
    example: 'users can authenticate safely via third-party providers',
    description: "Template field: 'so that [business benefit/outcome]'",
  })
  @IsString()
  @IsOptional()
  soThat?: string;

  @ApiPropertyOptional({
    example: 'Store secrets in environment variables on Render backend.',
    description: 'Implementation details and checklist',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: Status,
    default: Status.TODO,
    example: Status.TODO,
    description: 'Task progress status (TODO, IN_PROGRESS, IN_REVIEW, DONE)',
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiPropertyOptional({
    enum: Priority,
    default: Priority.MEDIUM,
    example: Priority.MEDIUM,
    description: 'Task priority level (LOW, MEDIUM, HIGH, CRITICAL)',
  })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Parent Story UUID',
  })
  @IsString()
  @IsOptional()
  storyId?: string;

  @ApiPropertyOptional({
    example: '5b2deb4d-3b7d-4bad-9bdd-2b0d7b3dcb7e',
    description: 'Assigned Sprint UUID',
  })
  @IsString()
  @IsOptional()
  sprintId?: string;
}
