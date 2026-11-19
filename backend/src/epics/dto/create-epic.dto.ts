import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status, Priority } from '@prisma/client';

export class CreateEpicDto {
  @ApiProperty({
    example: 'Authentication & Access Management',
    description: 'Title of the Epic',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'platform security administrator',
    description: "Template field: 'As a [role]'",
  })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({
    example: 'enforce multi-factor authentication and role-based permissions',
    description: "Template field: 'I want to [action/goal]'",
  })
  @IsString()
  @IsOptional()
  want?: string;

  @ApiPropertyOptional({
    example: 'prevent unauthorized access to enterprise milestone data',
    description: "Template field: 'so that [business benefit/outcome]'",
  })
  @IsString()
  @IsOptional()
  soThat?: string;

  @ApiPropertyOptional({
    example: 'Encompasses OAuth2, session management, and role-based access control.',
    description: 'Detailed description of the epic scope',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: Status,
    default: Status.TODO,
    example: Status.TODO,
    description: 'Epic status',
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiPropertyOptional({
    enum: Priority,
    default: Priority.MEDIUM,
    example: Priority.MEDIUM,
    description: 'Epic priority level',
  })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'Associated Milestone UUID',
  })
  @IsString()
  @IsOptional()
  milestoneId?: string;
}
