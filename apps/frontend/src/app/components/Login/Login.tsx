import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../services/api.service';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`🔐 Attempting login for username: ${username}`);
      const response = await ApiService.login(username);

      if (response.success) {
        console.log('✅ Login successful, navigating to portfolio');
        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(response.user));

        // Call the parent callback
        onLoginSuccess(response.user);

        // Navigate to portfolio page
        navigate('/portfolio');
      } else {
        console.log('❌ Login failed:', response.message);
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);

      // Handle different types of errors
      if (err.response?.status === 401) {
        setError(
          'Username not found in database. Please check your username or contact support.'
        );
      } else if (err.response?.status === 400) {
        setError('Please enter a valid username.');
      } else {
        setError(
          err.response?.data?.message || 'Login failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Stock Management
        </Typography>

        <Typography variant="h6" component="h2" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            variant="outlined"
            disabled={loading}
            autoFocus
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !username.trim()}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Enter your username to access your portfolio
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
