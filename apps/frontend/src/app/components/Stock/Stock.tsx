import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  IconButton,
  TextField,
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { StockDetail } from '@stock-management/libs';

interface StockProps {
  stock: StockDetail | null;
  open: boolean;
  onClose: () => void;
  onAddToPortfolio?: (stock: { name: string; quantity: number }) => void;
}

const Stock: React.FC<StockProps> = ({
  stock,
  open,
  onClose,
  onAddToPortfolio,
}) => {
  const [stockQuantity, setStockQuantity] = useState('1');
  const [quantityError, setQuantityError] = useState<string | null>(null);

  if (!stock) return null;

  const handleAddToPortfolio = () => {
    if (!stockQuantity || isNaN(parseFloat(stockQuantity))) {
      setQuantityError('Please enter a valid quantity');
      return;
    }

    if (parseFloat(stockQuantity) <= 0) {
      setQuantityError('Quantity must be greater than 0');
      return;
    }

    if (onAddToPortfolio) {
      onAddToPortfolio({
        name: stock.name,
        quantity: parseFloat(stockQuantity),
      });

      // Clear form and close modal
      setStockQuantity('1');
      onClose();
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStockQuantity(e.target.value);
    setQuantityError(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '60vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="div"
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            {stock.symbol}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {stock.name}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Basic Information */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Paper elevation={1} sx={{ p: 2, flex: 1, minWidth: 300 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: 'primary.main' }}
              >
                Basic Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Symbol:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {stock.symbol}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Company:
                  </Typography>
                  <Typography variant="body1">{stock.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Exchange:
                  </Typography>
                  <Typography variant="body1">{stock.exchange}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Market:
                  </Typography>
                  <Typography variant="body1">{stock.stockExchange}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Currency:
                  </Typography>
                  <Typography variant="body1">{stock.currency}</Typography>
                </Box>
              </Box>
            </Paper>

            {/* Market Data */}
            <Paper elevation={1} sx={{ p: 2, flex: 1, minWidth: 300 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: 'primary.main' }}
              >
                Market Data
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {stock.price && stock.price > 0 ? (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Current Price:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 'bold', color: 'primary.main' }}
                    >
                      ${stock.price.toFixed(2)}
                    </Typography>
                  </Box>
                ) : null}
                {stock.change !== undefined && stock.change !== 0 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Change:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {stock.change >= 0 ? (
                        <TrendingUp color="success" />
                      ) : (
                        <TrendingDown color="error" />
                      )}
                      <Chip
                        label={`${
                          stock.change >= 0 ? '+' : ''
                        }${stock.change.toFixed(2)}%`}
                        color={stock.change >= 0 ? 'success' : 'error'}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Box>
                ) : null}
                {stock.volume && stock.volume > 0 ? (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Volume:
                    </Typography>
                    <Typography variant="body1">
                      {stock.volume.toLocaleString()}
                    </Typography>
                  </Box>
                ) : null}
                {stock.marketCap && stock.marketCap > 0 ? (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Market Cap:
                    </Typography>
                    <Typography variant="body1">
                      {stock.marketCap >= 1000000000000
                        ? `$${(stock.marketCap / 1000000000000).toFixed(2)}T`
                        : stock.marketCap >= 1000000000
                        ? `$${(stock.marketCap / 1000000000).toFixed(2)}B`
                        : stock.marketCap >= 1000000
                        ? `$${(stock.marketCap / 1000000).toFixed(2)}M`
                        : `$${stock.marketCap.toLocaleString()}`}
                    </Typography>
                  </Box>
                ) : null}
              </Box>
            </Paper>
          </Box>

          {/* Financial Metrics */}
          {(stock.pe || stock.dividend) && (
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: 'primary.main' }}
              >
                Financial Metrics
              </Typography>
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {stock.pe && stock.pe > 0 ? (
                  <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                    <Typography variant="body2" color="text.secondary">
                      P/E Ratio
                    </Typography>
                    <Typography variant="h6">{stock.pe.toFixed(2)}</Typography>
                  </Box>
                ) : null}
                {stock.dividend && stock.dividend > 0 ? (
                  <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                    <Typography variant="body2" color="text.secondary">
                      Dividend Yield
                    </Typography>
                    <Typography variant="h6">
                      {stock.dividend.toFixed(2)}%
                    </Typography>
                  </Box>
                ) : null}
                {stock.eps && stock.eps !== 0 ? (
                  <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                    <Typography variant="body2" color="text.secondary">
                      EPS
                    </Typography>
                    <Typography variant="h6">
                      ${stock.eps.toFixed(2)}
                    </Typography>
                  </Box>
                ) : null}
              </Box>
            </Paper>
          )}

          {/* Additional Market Data */}
          {(stock.dayLow ||
            stock.dayHigh ||
            stock.yearLow ||
            stock.yearHigh ||
            stock.open ||
            stock.previousClose) && (
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: 'primary.main' }}
              >
                Additional Market Data
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {stock.dayLow && stock.dayHigh ? (
                  <Box sx={{ minWidth: 150 }}>
                    <Typography variant="body2" color="text.secondary">
                      Day Range
                    </Typography>
                    <Typography variant="body1">
                      ${stock.dayLow.toFixed(2)} - ${stock.dayHigh.toFixed(2)}
                    </Typography>
                  </Box>
                ) : null}
                {stock.yearLow && stock.yearHigh ? (
                  <Box sx={{ minWidth: 150 }}>
                    <Typography variant="body2" color="text.secondary">
                      52 Week Range
                    </Typography>
                    <Typography variant="body1">
                      ${stock.yearLow.toFixed(2)} - ${stock.yearHigh.toFixed(2)}
                    </Typography>
                  </Box>
                ) : null}
                {stock.open ? (
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="body2" color="text.secondary">
                      Open
                    </Typography>
                    <Typography variant="body1">
                      ${stock.open.toFixed(2)}
                    </Typography>
                  </Box>
                ) : null}
                {stock.previousClose ? (
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="body2" color="text.secondary">
                      Previous Close
                    </Typography>
                    <Typography variant="body1">
                      ${stock.previousClose.toFixed(2)}
                    </Typography>
                  </Box>
                ) : null}
                {stock.avgVolume ? (
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="body2" color="text.secondary">
                      Avg Volume
                    </Typography>
                    <Typography variant="body1">
                      {stock.avgVolume.toLocaleString()}
                    </Typography>
                  </Box>
                ) : null}
              </Box>
            </Paper>
          )}

          {/* Add to Portfolio Section */}
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: 'primary.main' }}
            >
              Add to Portfolio
            </Typography>
            <TextField
              label="Quantity"
              type="number"
              value={stockQuantity}
              onChange={handleQuantityChange}
              error={!!quantityError}
              helperText={quantityError}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              onClick={handleAddToPortfolio}
              fullWidth
              sx={{ mt: 2 }}
            >
              Add to Portfolio
            </Button>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Stock;
