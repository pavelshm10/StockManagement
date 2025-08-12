import React from 'react';
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
  onAddToPortfolio?: (stock: StockDetail) => void;
}

const Stock: React.FC<StockProps> = ({
  stock,
  open,
  onClose,
  onAddToPortfolio,
}) => {
  if (!stock) return null;

  const handleAddToPortfolio = () => {
    if (onAddToPortfolio) {
      onAddToPortfolio(stock);
      onClose();
    }
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
                {stock.price && (
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
                )}
                {stock.change !== undefined && (
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
                )}
                {stock.volume && (
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
                )}
                {stock.marketCap && (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Market Cap:
                    </Typography>
                    <Typography variant="body1">
                      ${(stock.marketCap / 1000000000).toFixed(2)}B
                    </Typography>
                  </Box>
                )}
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
                {stock.pe && (
                  <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                    <Typography variant="body2" color="text.secondary">
                      P/E Ratio
                    </Typography>
                    <Typography variant="h6">{stock.pe.toFixed(2)}</Typography>
                  </Box>
                )}
                {stock.dividend && (
                  <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                    <Typography variant="body2" color="text.secondary">
                      Dividend Yield
                    </Typography>
                    <Typography variant="h6">
                      {stock.dividend.toFixed(2)}%
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        {onAddToPortfolio && (
          <Button
            onClick={handleAddToPortfolio}
            variant="contained"
            color="primary"
            startIcon={<TrendingUp />}
          >
            Add to Portfolio
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Stock;
