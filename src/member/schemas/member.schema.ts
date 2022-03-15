/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MemberDocument = Member & Document;

@Schema({timestamps: true})
export class Member {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  salt: string;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  gender: boolean;

  @Prop()
  group: Array<string>;

}

export const MemberSchema = SchemaFactory.createForClass(Member);
