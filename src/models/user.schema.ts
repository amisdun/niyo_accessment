import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
})
export class User extends Document {
  @ApiProperty({
    type: String,
    description: 'User first name',
    example: 'John',
  })
  @Prop({ required: true })
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'User last name',
    example: 'Doe',
  })
  @Prop({ required: true })
  lastName: string;

  @ApiProperty({
    type: String,
    description: 'User other names',
    example: 'Smithy',
  })
  @Prop({ nullable: true })
  otherNames: string;

  @ApiProperty({
    type: String,
    description: 'User email',
    example: 'john.doe@example.com',
  })
  @Prop({ required: true })
  email: string;

  @ApiProperty({
    type: String,
    description: 'User password',
  })
  @Prop({ type: SchemaTypes.String, required: false })
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
