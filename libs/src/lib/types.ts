export interface Stock {
  name: string;
  price: number;
  change: number;
}

export interface Portfolio {
  user: string;
  stocks: Stock[];
  total_price: number;
  percentage_change: number;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  exchangeShortName: string;
}
