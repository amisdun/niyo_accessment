import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, SchemaTypes } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskType {
  HIGH = 'HIGH',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
})
export class Task extends Document {
  @ApiProperty({
    type: String,
    description: 'User first name',
    example: 'John',
  })
  @Prop({ required: true, type: SchemaTypes.String })
  name: string;

  @ApiProperty()
  @Prop({ ref: 'User', required: true, type: mongoose.Types.ObjectId })
  user: { type: mongoose.Types.ObjectId; ref: 'User' };

  @ApiProperty({
    type: String,
    description: 'User last name',
    example: 'Doe',
  })
  @Prop({ required: true, type: SchemaTypes.String })
  description: string;

  @ApiProperty({
    type: String,
    description: 'User other names',
    example: 'Smithy',
  })
  @Prop({ required: true, enum: TaskType, default: TaskType.MEDIUM })
  priority: TaskType;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
