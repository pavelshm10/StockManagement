import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PortfolioDocument = Portfolio & Document;

@Schema()
export class Stock {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;
}

@Schema()
export class Portfolio {
  @Prop({ required: true })
  user: string;

  @Prop({ type: [Stock], required: true })
  stocks: Stock[];
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
