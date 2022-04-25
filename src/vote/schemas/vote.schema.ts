/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VoteDocument = Vote & Document;

@Schema({timestamps: true})
export class Vote {

  @Prop()
  idgroup: string;

  @Prop()
  open: boolean;

  @Prop()
  timeout: Date;

  @Prop()
  header: string;

  @Prop()
  owner: string

  @Prop()
  select: Array<string>;

  @Prop()
  score: Array<number>;

  @Prop()
  voted: Array<string>;

}

export const VoteSchema = SchemaFactory.createForClass(Vote);
