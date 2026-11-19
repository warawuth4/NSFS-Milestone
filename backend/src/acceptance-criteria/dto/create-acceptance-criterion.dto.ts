import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAcceptanceCriterionDto {
  @ApiProperty({
    example: 'an authenticated team member is reviewing the project milestone landing page',
    description: "Template field: 'Given [context / initial state]'",
  })
  @IsString()
  @IsNotEmpty()
  given: string;

  @ApiProperty({
    example: 'the user changes a task status from TODO to DONE in 2 clicks',
    description: "Template field: 'When [action / event happens]'",
  })
  @IsString()
  @IsNotEmpty()
  when: string;

  @ApiProperty({
    example: 'the milestone progress bar immediately recalculates and reflects the new percentage',
    description: "Template field: 'Then [expected outcome / assertion]'",
  })
  @IsString()
  @IsNotEmpty()
  then: string;

  @ApiPropertyOptional({
    default: false,
    example: false,
    description: 'Whether this acceptance criterion is verified and satisfied',
  })
  @IsBoolean()
  @IsOptional()
  isMet?: boolean;

  @ApiPropertyOptional({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Associated Epic UUID (if criterion applies to an epic)',
  })
  @IsString()
  @IsOptional()
  epicId?: string;

  @ApiPropertyOptional({
    example: '4ba85f64-5717-4562-b3fc-2c963f66afa7',
    description: 'Associated Story UUID (if criterion applies to a story)',
  })
  @IsString()
  @IsOptional()
  storyId?: string;

  @ApiPropertyOptional({
    example: '5ba85f64-5717-4562-b3fc-2c963f66afa8',
    description: 'Associated Task UUID (if criterion applies to a task)',
  })
  @IsString()
  @IsOptional()
  taskId?: string;
}
