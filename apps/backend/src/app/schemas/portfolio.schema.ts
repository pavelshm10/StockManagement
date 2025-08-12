import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PortfolioDocument = Portfolio & Document;

@Schema()
export class Stock {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  symbol: string;
}

@Schema()
export class PortfolioStock {
  @Prop({ required: true })
  stock: Stock;

  @Prop({ required: true })
  quantity: number;
}

@Schema()
export class Portfolio {
  @Prop({ required: true })
  user: string;

  @Prop({ type: [PortfolioStock], required: true })
  stocks: PortfolioStock[];
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
