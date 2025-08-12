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
  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h3" gutterBottom>
        Hello, {userId}
      </Typography>

      {/* Stock Search and Add Section */}
      {portfolio && <SearchStock />}

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
                      Quantity
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
                  <TableRow key={stock.stock.symbol}>
                    <TableCell>
                      <Typography variant="body1">
                        {stock.stock?.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" color="primary">
                        ${stock.quantity}
                      </Typography>
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
