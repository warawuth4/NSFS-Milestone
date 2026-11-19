import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status, Priority } from '@prisma/client';

export class CreateStoryDto {
  @ApiProperty({
    example: 'OAuth2 Social Login',
    description: 'Title of the user story',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'registered developer',
    description: "Template field: 'As a [role]'",
  })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({
    example: 'log in using my GitHub or Google credentials',
    description: "Template field: 'I want to [action/goal]'",
  })
  @IsString()
  @IsOptional()
  want?: string;

  @ApiPropertyOptional({
    example: 'access my milestones without creating another password',
    description: "Template field: 'so that [business benefit/outcome]'",
  })
  @IsString()
  @IsOptional()
  soThat?: string;

  @ApiPropertyOptional({
    example: 'Integrate Supabase OAuth provider flow with redirect tokens.',
    description: 'Additional notes or specification',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: Status,
    default: Status.TODO,
    example: Status.TODO,
    description: 'Story status (TODO, IN_PROGRESS, IN_REVIEW, DONE)',
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiPropertyOptional({
    enum: Priority,
    default: Priority.MEDIUM,
    example: Priority.MEDIUM,
    description: 'Priority level',
  })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Parent Epic UUID',
  })
  @IsString()
  @IsOptional()
  epicId?: string;
}
