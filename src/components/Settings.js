import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  Divider
} from '@mui/material';
import { setExchangeUrl, getExchangeUrl, getExchangeRates } from '../services/currencyService';

const Settings = () => {
  const [exchangeUrl, setExchangeUrlState] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Load current settings
    setExchangeUrlState(getExchangeUrl());
  }, []);

  const handleUrlChange = (event) => {
    setExchangeUrlState(event.target.value);
  };

  const handleSaveSettings = () => {
    try {
      setExchangeUrl(exchangeUrl);
      
      setSnackbar({
        open: true,
        message: 'Settings saved successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error saving settings: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleTestConnection = async () => {
    try {
      const response = await fetch(exchangeUrl);
      if (!response.ok) {
        throw new Error('Failed to connect to the URL');
      }
      
      const data = await response.json();
      
      // Check if the response has the expected structure
      if (typeof data === 'object' && data !== null) {
        setSnackbar({
          open: true,
          message: 'Connection test successful!',
          severity: 'success'
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Connection test failed: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const currentRates = getExchangeRates();

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Configure your currency exchange rate settings and application preferences.
      </Typography>

      <Box sx={{ maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>
          Currency Exchange Rates
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Configure the URL for fetching currency exchange rates. The API should return a JSON object with currency codes as keys and exchange rates as values.
        </Typography>

        <TextField
          fullWidth
          label="Exchange Rates URL"
          value={exchangeUrl}
          onChange={handleUrlChange}
          margin="normal"
          placeholder="https://api.exchangerate-api.com/v4/latest/USD"
          helperText="Enter a valid URL that returns exchange rates in JSON format"
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleTestConnection}
            disabled={!exchangeUrl}
          >
            Test Connection
          </Button>
          
          <Button
            variant="contained"
            onClick={handleSaveSettings}
            disabled={!exchangeUrl}
          >
            Save Settings
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Current Exchange Rates
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Current exchange rates being used by the application:
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          {Object.entries(currentRates).map(([currency, rate]) => (
            <Paper key={currency} elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {currency}
              </Typography>
              <Typography variant="body1">
                {rate.toFixed(4)}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Supported Currencies
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          The application supports the following currencies: USD, ILS, GBP, and EURO.
        </Typography>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Settings;
