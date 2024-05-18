import { TaskType } from '@app/models/task.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class TaskDto {
  @ApiProperty({
    name: 'name',
    required: true,
  })
  @IsNotEmpty({ message: 'name field is required' })
  @IsString({ message: 'name field should be a string' })
  name: string;

  @ApiProperty({
    name: 'description',
    required: true,
  })
  @IsNotEmpty({ message: 'description field is required' })
  @IsString({ message: 'description field should be a string' })
  description: string;

  @ApiProperty({
    name: 'priority',
    required: true,
    enum: TaskType,
  })
  @IsEnum(TaskType)
  @IsNotEmpty({ message: 'priority field is required' })
  @IsString({ message: 'priority field should be a string' })
  priority: string;
}

export class UpdateTaskDto extends TaskDto {}
