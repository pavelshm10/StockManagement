import React, { useState } from 'react';
import {
  TextField,
  Button,
  Autocomplete,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Alert,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import ApiService from '../../../services/api.service';
import Stock from '../Stock';
import { StockSearchResult, StockDetail } from '@stock-management/libs';

interface SearchStockProps {
  onAddStock: (stock: { name: string; price: number }) => void;
}

const SearchStock: React.FC<SearchStockProps> = ({ onAddStock }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(
    null
  );
  const [stockPrice, setStockPrice] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [stockDetail, setStockDetail] = useState<StockDetail | null>(null);
  const [showStockDetail, setShowStockDetail] = useState(false);
  const [loadingStockDetail, setLoadingStockDetail] = useState(false);

  const searchStocks = async (query: string) => {
    if (query.length < 1) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    try {
      setSearching(true);
      setSearchError(null);
      const apiKey = import.meta.env.VITE_API_KEY;

      if (!apiKey) {
        setSearchError(
          'API key not configured. Please set VITE_API_KEY in your environment variables.'
        );
        return;
      }

      const data = await ApiService.searchStocks(query, apiKey);

      if (!Array.isArray(data)) {
        setSearchError('Invalid response from stock search API');
        return;
      }

      const stockResults: StockSearchResult[] = data
        .filter((item: any) => item.symbol && item.name) // Only include items with both symbol and name
        .map((item: any) => ({
          symbol: item.symbol || item.ticker || '',
          name: item.name || item.companyName || item.longName || '',
          exchange: item.exchange || item.stockExchange || '',
          exchangeShortName:
            item.exchangeShortName || item.stockExchange || item.exchange || '',
          currency: item.currency || 'USD',
          stockExchange: item.stockExchange || item.exchange || '',
        }));

      setSearchResults(stockResults);

      if (stockResults.length === 0 && query.length > 0) {
        setSearchError('No stocks found for your search query');
      }
    } catch (err) {
      console.error('Failed to search stocks:', err);
      setSearchError('Failed to search stocks. Please try again.');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const fetchStockDetail = async (stock: StockSearchResult) => {
    try {
      setLoadingStockDetail(true);
      const apiKey = import.meta.env.VITE_API_KEY;

      // Create stock detail with the available data and placeholder values for missing data
      const stockDetail: StockDetail = {
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange,
        exchangeShortName: stock.exchangeShortName,
        currency: stock.currency || 'USD',
        stockExchange: stock.stockExchange || stock.exchange,
        // For now, using placeholder data - you can extend this with real API calls
        // to fetch live price, volume, market cap, etc.
        price: Math.random() * 1000, // Placeholder - replace with real API call
        change: (Math.random() - 0.5) * 20, // Placeholder - replace with real API call
        volume: Math.floor(Math.random() * 10000000), // Placeholder
        marketCap: Math.random() * 100000000000, // Placeholder
        pe: Math.random() * 50, // Placeholder
        dividend: Math.random() * 5, // Placeholder
      };

      setStockDetail(stockDetail);
      setShowStockDetail(true);
    } catch (err) {
      console.error('Failed to fetch stock details:', err);
      setSearchError('Failed to fetch stock details. Please try again.');
    } finally {
      setLoadingStockDetail(false);
    }
  };

  const handleSearchChange = (event: React.SyntheticEvent, value: string) => {
    setSearchQuery(value);
    setSearchError(null);
    if (value) {
      searchStocks(value);
    } else {
      setSearchResults([]);
      setSelectedStock(null);
    }
  };

  const handleStockSelect = (
    event: React.SyntheticEvent,
    stock: StockSearchResult | null
  ) => {
    setSelectedStock(stock);
    if (stock) {
      setSearchQuery(stock.symbol);
      // Fetch and show stock details
      fetchStockDetail(stock);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedStock && stockPrice && !isNaN(parseFloat(stockPrice))) {
      const price = parseFloat(stockPrice);
      onAddStock({
        name: selectedStock.name,
        price: price,
      });

      // Clear form after adding
      setSearchQuery('');
      setSelectedStock(null);
      setStockPrice('');
      setSearchResults([]);
      setSearchError(null);
    }
  };

  const handleAddToPortfolioFromDetail = (stock: StockDetail) => {
    if (stockPrice && !isNaN(parseFloat(stockPrice))) {
      const price = parseFloat(stockPrice);
      onAddStock({
        name: stock.name,
        price: price,
      });

      // Clear form after adding
      setSearchQuery('');
      setSelectedStock(null);
      setStockPrice('');
      setSearchResults([]);
      setSearchError(null);
      setShowStockDetail(false);
      setStockDetail(null);
    }
  };

  const getOptionLabel = (option: StockSearchResult) => {
    return `${option.symbol} - ${option.name}`;
  };

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: StockSearchResult
  ) => (
    <Box component="li" {...props}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {option.symbol}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {option.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {option.exchangeShortName}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add Stock
        </Typography>

        {searchError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {searchError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <Autocomplete
            options={searchResults}
            getOptionLabel={getOptionLabel}
            renderOption={renderOption}
            value={selectedStock}
            onChange={handleStockSelect}
            onInputChange={handleSearchChange}
            inputValue={searchQuery}
            loading={searching}
            filterOptions={(x) => x} // Disable built-in filtering since we're doing API search
            noOptionsText={searching ? 'Searching...' : 'No stocks found'}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Stock"
                placeholder="Type to search stocks (e.g., AAPL, GOOGL)"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {searching ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

        </Box>
      </Paper>

      {/* Stock Detail Modal */}
      <Stock
        stock={stockDetail}
        open={showStockDetail}
        onClose={() => {
          setShowStockDetail(false);
          setStockDetail(null);
        }}
        onAddToPortfolio={handleAddToPortfolioFromDetail}
      />
    </>
  );
};

export default SearchStock;
