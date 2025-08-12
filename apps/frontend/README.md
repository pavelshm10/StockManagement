# Frontend Application

This is the frontend application for the Stock Management system, built with React, TypeScript, and Material-UI.

## Components

### Portfolio Component

The main portfolio component that displays:

- Portfolio summary (user, total value, total change)
- Stock search and addition functionality
- List of current stocks in the portfolio

### SearchStock Component

A new, separate component that handles stock search and addition:

**Features:**

- Real-time stock search using the Financial Modeling Prep API
- Autocomplete dropdown with stock suggestions
- **Click on any search option to view detailed stock information**
- Price input validation
- Error handling and user feedback
- Material-UI components for modern, responsive design

**Props:**

- `onAddStock`: Callback function that receives the selected stock data

**Usage:**

```tsx
import SearchStock from './components/SearchStock';

<SearchStock
  onAddStock={(stock) => {
    // Handle adding stock to portfolio
    console.log('Adding stock:', stock);
  }}
/>;
```

### Stock Component

A new component that displays detailed stock information in a modal:

**Features:**

- **Opens automatically when clicking on a search option**
- Displays comprehensive stock information:
  - Basic Information: Symbol, Company Name, Exchange, Market, Currency
  - Market Data: Current Price, Change %, Volume, Market Cap
  - Financial Metrics: P/E Ratio, Dividend Yield
- Modern Material-UI dialog design
- Option to add stock to portfolio directly from the detail view

**Stock Information Displayed:**

- **Symbol**: Stock ticker symbol (e.g., "AZ")
- **Name**: Company name (e.g., "A2Z Smart Technologies Corp.")
- **Exchange**: Stock exchange (e.g., "NASDAQ")
- **Market**: Specific market segment (e.g., "NASDAQ Capital Market")
- **Currency**: Trading currency (e.g., "USD")
- **Price**: Current stock price
- **Change**: Percentage change
- **Volume**: Trading volume
- **Market Cap**: Market capitalization
- **P/E Ratio**: Price-to-Earnings ratio
- **Dividend**: Dividend yield

## User Experience Flow

1. **Search**: Type in the search box to find stocks
2. **Select**: Click on any search result option
3. **View Details**: Stock detail modal automatically opens showing all available information
4. **Add to Portfolio**: Enter price and add stock from either the search form or detail modal

## Material-UI Integration

The application uses Material-UI (MUI) for:

- Consistent design system
- Responsive components
- Built-in theming
- Accessibility features

## Environment Variables

Make sure to set the following environment variable:

- `VITE_API_KEY`: Your Financial Modeling Prep API key for stock search functionality

## Running the Application

```bash
npm run start:frontend
```

The application will be available at `http://localhost:4200` (or the port specified by Vite).

## API Dependencies

- **Backend API**: For portfolio management
- **Financial Modeling Prep API**: For stock search functionality

## Future Enhancements

- Real-time stock price updates
- Additional financial metrics
- Stock charts and graphs
- Portfolio performance analytics
