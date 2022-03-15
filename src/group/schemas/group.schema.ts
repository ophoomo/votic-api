/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema({timestamps: true})
export class Group {
  
  @Prop()
  code: string

  @Prop()
  name: string;

  @Prop()
  owner: string

  @Prop()
  member: Array<string>;

}

export const GroupSchema = SchemaFactory.createForClass(Group);
