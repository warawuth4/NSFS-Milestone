import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignTaskDto {
  @ApiProperty({
    example: 'd3b07384-d113-46c1-a968-3d5f1345f891',
    description: 'Task UUID to assign into this sprint',
  })
  @IsString()
  @IsNotEmpty()
  taskId: string;
}
