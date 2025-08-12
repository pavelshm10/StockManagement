import React, { useState, useCallback, useEffect } from 'react';
import {
  TextField,
  Button,
  Autocomplete,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  Chip,
} from '@mui/material';
import ApiService from '../../../services/api.service';
import Stock from '../Stock';
import { StockSearchResult, StockDetail } from '@stock-management/libs';

interface SearchStockProps {
  onAddToPortfolio?: (stockData: {
    name: string;
    quantity: number;
    symbol?: string;
  }) => void;
}

const SearchStock: React.FC<SearchStockProps> = ({ onAddToPortfolio }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(
    null
  );
  const [searchError, setSearchError] = useState<string | null>(null);
  const [stockDetail, setStockDetail] = useState<StockDetail | null>(null);
  const [showStockDetail, setShowStockDetail] = useState(false);
  const [loadingStockDetail, setLoadingStockDetail] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  const debouncedSearch = useCallback(
    (query: string) => {
      // Clear any existing timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      // Set a new timeout for the search
      const timeout = setTimeout(() => {
        if (query && query.length >= 1) {
          searchStocks(query);
        }
      }, 300); // 300ms delay

      setSearchTimeout(timeout);
    },
    [searchTimeout]
  );

  const searchStocks = async (query: string) => {
    if (query.length < 1) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    try {
      setSearching(true);
      setSearchError(null);

      const data = await ApiService.searchStocks(query);

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
          id: `${item.symbol || item.ticker || ''}-${
            item.exchange || item.stockExchange || ''
          }`,
        }))
        // Remove duplicates based on symbol and exchange combination
        .filter(
          (stock, index, self) =>
            index ===
            self.findIndex(
              (s) => s.symbol === stock.symbol && s.exchange === stock.exchange
            )
        );

      setSearchResults(stockResults);
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
      const quoteData = await ApiService.getStockQuote(stock.symbol);
      if (!quoteData) {
        setSearchError('Failed to fetch stock details from API');
        return;
      }
      setStockDetail(quoteData);
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

    if (value && value.length >= 1) {
      debouncedSearch(value);
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
      // Don't change the search query when selecting - keep what user typed
      // setSearchQuery(stock.symbol);
    }
  };

  const handleViewStockDetails = () => {
    if (selectedStock) {
      fetchStockDetail(selectedStock);
    }
  };

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: StockSearchResult
  ) => (
    <Box
      component="li"
      {...props}
      key={option.id || `${option.symbol}-${option.exchange}`}
    >
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

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Autocomplete
            options={searchResults}
            getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
            isOptionEqualToValue={(option, value) =>
              option.id === value.id ||
              (option.symbol === value.symbol &&
                option.exchange === value.exchange)
            }
            renderOption={renderOption}
            value={selectedStock}
            onChange={handleStockSelect}
            onInputChange={handleSearchChange}
            inputValue={searchQuery}
            loading={searching}
            filterOptions={(x) => x} // Disable built-in filtering since we're doing API search
            noOptionsText={searching ? 'Searching...' : 'No stocks found'}
            freeSolo={false}
            selectOnFocus={false}
            clearOnBlur={false}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Stock"
                placeholder="Type to search stocks (e.g., AAPL, GOOGL)"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {selectedStock && (
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mr: 1 }}
                        >
                          <Chip
                            label={selectedStock.symbol}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      )}
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

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {selectedStock && (
              <Button
                variant="outlined"
                onClick={handleViewStockDetails}
                disabled={loadingStockDetail}
                startIcon={
                  loadingStockDetail ? <CircularProgress size={20} /> : null
                }
              >
                {loadingStockDetail ? 'Loading...' : 'View Stock Details'}
              </Button>
            )}
          </Box>
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
        onAddToPortfolio={onAddToPortfolio}
      />
    </>
  );
};

export default SearchStock;
