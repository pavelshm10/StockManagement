import React, { useState, useEffect } from 'react';
import './Portfolio.css';
import ApiService from '../../services/api.service';
import {
  Portfolio as PortfolioType,
  Stock,
  StockSearchResult,
} from '@stock-management/libs';

// Full Portfolio component with automatic data loading
const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState('user1'); // Default user ID
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Auto-load portfolio when component mounts
  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        const data = await ApiService.getPortfolio(userId);
        setPortfolio(data);
      } catch (err: any) {
        // If portfolio doesn't exist (404), create a new one
        if (
          err.message?.includes('404') ||
          err.message?.includes('not found')
        ) {
          await createPortfolio();
          return;
        }
        throw err;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch portfolio'
      );
    } finally {
      setLoading(false);
    }
  };

  const createPortfolio = async () => {
    try {
      const newPortfolio: PortfolioType = {
        user: userId,
        stocks: [],
        total_price: 0,
        percentage_change: 0,
      };

      const data = await ApiService.createPortfolio(newPortfolio);
      setPortfolio(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create portfolio'
      );
    }
  };

  const searchStocks = async (query: string) => {
    if (query.length < 1) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      setSearching(true);
      const apiKey = import.meta.env.VITE_API_KEY;
      const data = await ApiService.searchStocks(query, apiKey);
      const stockResults: StockSearchResult[] = data.map((item: any) => ({
        symbol: item.symbol || item.ticker || '',
        name: item.name || item.companyName || '',
        exchange: item.exchange || item.stockExchange || '',
        exchangeShortName: item.exchangeShortName || item.stockExchange || '',
      }));
      setSearchResults(stockResults);
      setShowDropdown(true);
    } catch (err) {
      console.error('Failed to search stocks:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchStocks(query);
  };

  const selectStock = (stock: StockSearchResult) => {
    setSearchQuery(stock.symbol);
    setShowDropdown(false);
    setSearchResults([]);

    // Focus on price input for better UX
    setTimeout(() => {
      const priceInput = document.getElementById(
        'stockPrice'
      ) as HTMLInputElement;
      if (priceInput) {
        priceInput.focus();
      }
    }, 100);
  };

  const addStock = async (stock: Omit<Stock, 'change'>) => {
    if (!portfolio) return;
    const newStock: Stock = {
      ...stock,
      change: 0,
    };

    const updatedStocks = [...portfolio.stocks, newStock];
    const totalPrice = updatedStocks.reduce((sum, s) => sum + s.price, 0);
    const percentageChange = updatedStocks.reduce(
      (sum, s) => sum + s.change,
      0
    );

    const updatedPortfolio: PortfolioType = {
      ...portfolio,
      stocks: updatedStocks,
      total_price: totalPrice,
      percentage_change: percentageChange,
    };
    try {
      const data = await ApiService.updatePortfolio(userId, updatedPortfolio);
      console.log('Stock added successfully:', data);
      setPortfolio(data);
      setSearchQuery(''); // Clear search after adding
      setShowDropdown(false); // Hide dropdown
      setSearchResults([]); // Clear search results
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add stock');
    }
  };

  if (loading) {
    return <div className="loading">Loading portfolio...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="portfolio">
      <h1>Hello, {userId}</h1>

      {portfolio && (
        <div className="portfolio-summary">
          <h2>Portfolio Summary</h2>
          <p>
            <strong>User:</strong> {portfolio.user}
          </p>
          <p>
            <strong>Total Value:</strong> ${portfolio.total_price.toFixed(2)}
          </p>
          <p>
            <strong>Total Change:</strong>{' '}
            {portfolio.percentage_change.toFixed(2)}%
          </p>
        </div>
      )}

      {/* Stock Search and Add Section */}
      {portfolio && (
        <div className="add-stock">
          <h2>Add Stock</h2>

          {/* Stock Search Input with Dropdown */}
          <div className="search-container">
            <label htmlFor="stockSearch">Search Stock: </label>
            <div className="search-input-container">
              <input
                id="stockSearch"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Type to search stocks (e.g., AAPL, GOOGL)"
                className="search-input"
              />
              {searching && <div className="search-spinner">🔍</div>}

              {/* Dropdown with search results */}
              {showDropdown && searchResults.length > 0 && (
                <div className="search-dropdown">
                  {searchResults.map(
                    (stock: StockSearchResult, index: number) => (
                      <div
                        key={index}
                        className="search-result-item"
                        onClick={() => selectStock(stock)}
                      >
                        <span className="stock-symbol">{stock.symbol}</span>
                        <span className="stock-name">{stock.name}</span>
                        <span className="stock-exchange">
                          {stock.exchangeShortName}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const priceInput = (e.target as HTMLFormElement).querySelector(
                '#stockPrice'
              ) as HTMLInputElement;
              const price = parseFloat(priceInput.value);

              if (searchQuery && searchResults.length > 0 && !isNaN(price)) {
                const selectedStock = searchResults.find(
                  (s) => s.symbol === searchQuery
                );
                if (selectedStock) {
                  addStock({
                    name: selectedStock.name,
                    price: price,
                  });
                  // Clear form after adding
                  priceInput.value = '';
                  setSearchQuery('');
                  setShowDropdown(false);
                  setSearchResults([]);
                }
              }
            }}
          >
            <button
              type="submit"
              disabled={!searchQuery || searchResults.length === 0}
              className="add-stock-btn"
            >
              Add Stock to Portfolio
            </button>
          </form>
        </div>
      )}

      {portfolio && portfolio.stocks.length > 0 && (
        <div className="stocks-list">
          <h2>Stocks</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.stocks.map((stock, index) => (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>${stock.price.toFixed(2)}</td>
                  <td className={stock.change >= 0 ? 'positive' : 'negative'}>
                    {stock.change >= 0 ? '+' : ''}
                    {stock.change.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
