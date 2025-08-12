import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../../../services/api.service';
import SearchStock from '../SearchStock/SearchStock';
import { Portfolio as PortfolioType, Stock as StockType } from '@stock-management/libs';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Button,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StockDetailDialog from '../Stock/Stock';


interface PortfolioProps {
  onLogout: () => void;
}

// Full Portfolio component with automatic data loading
const Portfolio: React.FC<PortfolioProps> = ({ onLogout }) => {
  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);
  const [user, setUser] = useState<any>(null);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [showStockDetail, setShowStockDetail] = useState(false);
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  // Get user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      console.log('👤 User loaded from localStorage:', userData);

      // Fetch portfolio immediately when user is loaded
      if (userData._id) {
        console.log('📊 Fetching portfolio for user:', userData._id);
        fetchPortfolio(userData._id);
      } else {
        console.warn('⚠️ User ID not found, cannot fetch portfolio');
      }
    } else {
      console.warn('⚠️ No user found in localStorage');
    }
  }, []);

  const handleLogout = () => {
    console.log('🔘 Logout button clicked');
    localStorage.removeItem('user');
    onLogout(); // Call parent logout callback
  };

  useEffect(() => {
    if (user && user._id && !portfolio) {
      fetchPortfolio(user._id);
    }
  }, [user, portfolio]);

  const fetchPortfolio = async (userId: string) => {
    try {
      console.log('🔍 Fetching portfolio for user ID:', userId);
      const data = await ApiService.getPortfolio(userId);
      console.log('📊 Portfolio data received:', data);
      setPortfolio(data);
    } catch (err: any) {
      console.error('❌ Error fetching portfolio:', err);
      // Don't throw the error, just log it and set portfolio to null
      setPortfolio(null);
    }
  };

  const handleAddToPortfolio = async (stockData: {
    name: string;
    quantity: number;
    symbol?: string;
  }) => {
    if (!user || !portfolio) return;

    try {
      const newStock = {
        stock: {
          name: stockData.name,
          symbol: stockData.symbol || stockData.name,
        },
        quantity: stockData.quantity,
      };

      const updatedPortfolio = await ApiService.updatePortfolio(user._id, {
        stocks: [...portfolio.stocks, newStock],
      });

      if (updatedPortfolio) {
        setPortfolio(updatedPortfolio);
      }
    } catch (error) {
      console.error('Error adding stock to portfolio:', error);
    }
  };

  const handleRemoveFromPortfolio = async (stockSymbol: string) => {
    if (!user || !portfolio) return;

    try {
      console.log(`🗑️ Removing stock with symbol: ${stockSymbol}`);

      // Filter out the stock to be removed (check both symbol and name as fallback)
      const updatedStocks = portfolio.stocks.filter(
        (stock) =>
          stock.stock.symbol !== stockSymbol && stock.stock.name !== stockSymbol
      );

      const updatedPortfolio = await ApiService.updatePortfolio(user._id, {
        stocks: updatedStocks,
      });

      if (updatedPortfolio) {
        setPortfolio(updatedPortfolio);
        console.log(`✅ Stock ${stockSymbol} removed from portfolio`);
      }
    } catch (error) {
      console.error('Error removing stock from portfolio:', error);
    }
  };

  const handleStockClick = async (stock: any) => {
    try {
      console.log(`🔍 Opening stock details for: ${stock.stock.name}`);
      
      // Fetch detailed stock information
      const stockDetail = await ApiService.getStockQuote(stock.stock.symbol || stock.stock.name);
      
      if (stockDetail) {
        setSelectedStock(stockDetail);
        setShowStockDetail(true);
      } else {
        console.warn('⚠️ Could not fetch stock details');
      }
    } catch (error) {
      console.error('❌ Error fetching stock details:', error);
    }
  };
  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h3">Hello, {user?.name || user?._id}</Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleLogout}
          sx={{ ml: 2 }}
        >
          Logout
        </Button>
      </Box>

      {/* Stock Search and Add Section */}
      {portfolio ? (
        <>
          <SearchStock onAddToPortfolio={handleAddToPortfolio} />

          {portfolio.stocks.length > 0 && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Stocks
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Quantity
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Actions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {portfolio.stocks.map((stock, index) => (
                      <TableRow key={stock.stock.symbol}>
                        <TableCell>
                          <Typography 
                            variant="body1"
                            onClick={() => handleStockClick(stock)}
                            sx={{
                              cursor: 'pointer',
                              color: 'primary.main',
                              '&:hover': {
                                textDecoration: 'underline',
                                color: 'primary.dark',
                              },
                            }}
                          >
                            {stock.stock?.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" color="primary">
                            {stock.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              handleRemoveFromPortfolio(
                                stock.stock.symbol || stock.stock.name
                              )
                            }
                            color="error"
                            size="small"
                            title="Remove stock from portfolio"
                            sx={{
                              '&:hover': {
                                backgroundColor: 'error.light',
                                color: 'white',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      ) : (
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Loading portfolio...
          </Typography>
        </Paper>
      )}

      {/* Stock Detail Dialog */}
      <StockDetailDialog
        stock={selectedStock}
        open={showStockDetail}
        onClose={() => {
          setShowStockDetail(false);
          setSelectedStock(null);
        }}
        showAddToPortfolio={false}
      />
    </Box>
  );
};

export default Portfolio;
