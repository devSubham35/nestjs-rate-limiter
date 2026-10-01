import { PLAN_TYPE } from '../apiKey.types';
import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type APIKeyDocument = HydratedDocument<APIKey>;

@Schema({ versionKey: false, timestamps: true })
export class APIKey {

  @Prop({
    ref: 'User',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  userId!: mongoose.Types.ObjectId;

  @Prop({ required: true })
  apiId!: string;

  @Prop({ required: true, maxLength: 100 })
  title!: string;

  @Prop({ required: true })
  keyHash!: string;

  @Prop({ required: true, maxLength: 100 })
  plan!: PLAN_TYPE;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ default: 100 })
  rateLimit?: number;

  @Prop({ default: 60 })
  window?: number;

  createdAt?: string
  updatedAt?: string

}

export const APIKeySchema = SchemaFactory.createForClass(APIKey);
