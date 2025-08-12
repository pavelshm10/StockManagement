export interface Stock {
  name: string;
  symbol?: string;
}

export interface PortfolioStock {
  stock: Stock;
  quantity: number;
}

export interface Portfolio {
  user: string;
  stocks: PortfolioStock[];
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  exchangeShortName: string;
  currency?: string;
  stockExchange?: string;
  id?: string; // Unique identifier for React keys
}

export interface StockDetail {
  symbol: string;
  name: string;
  exchange: string;
  exchangeShortName: string;
  currency: string;
  stockExchange: string;
  price?: number;
  change?: number;
  volume?: number;
  marketCap?: number;
  pe?: number;
  dividend?: number;
  // Additional fields from the quote API
  dayLow?: number;
  dayHigh?: number;
  yearHigh?: number;
  yearLow?: number;
  open?: number;
  previousClose?: number;
  eps?: number;
  sharesOutstanding?: number;
  avgVolume?: number;
}
