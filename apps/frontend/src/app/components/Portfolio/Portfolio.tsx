import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../../../services/api.service';
import SearchStock from '../SearchStock/SearchStock';
import { Portfolio as PortfolioType, Stock } from '@stock-management/libs';
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
} from '@mui/material';

// Full Portfolio component with automatic data loading
const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);
  const [userId, setUserId] = useState('user1'); // Default user ID
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchPortfolio();
    }
  }, []);

  const fetchPortfolio = async () => {
    try {
      try {
        const data = await ApiService.getPortfolio(userId);
        setPortfolio(data);
      } catch (err: any) {
        throw err;
      }
    } catch (err) {
      throw err;
    } 
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
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h3" gutterBottom>
        Hello, {userId}
      </Typography>

      {portfolio && <SearchStock onAddStock={addStock} />}

      {portfolio && portfolio.stocks.length > 0 && (
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
                      Price
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Change
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {portfolio.stocks.map((stock, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body1">{stock.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" color="primary">
                        ${stock.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${
                          stock.change >= 0 ? '+' : ''
                        }${stock.change.toFixed(2)}%`}
                        color={stock.change >= 0 ? 'success' : 'error'}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default Portfolio;
