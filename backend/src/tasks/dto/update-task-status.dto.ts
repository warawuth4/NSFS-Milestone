import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateTaskStatusDto {
  @ApiProperty({
    enum: Status,
    example: Status.DONE,
    description: 'Updated progress status for the task (TODO, IN_PROGRESS, IN_REVIEW, DONE)',
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
