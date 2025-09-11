/**
 * Settings component
 * Allows configuring the exchange rates API URL and viewing current rates.
 */
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
import { setExchangeUrl, getExchangeUrl, getExchangeRates, fetchExchangeRates } from '../services/currencyService';
import FeedbackSnackbar from './FeedbackSnackbar';
// currencyService abstracts storage and retrieval of FX configuration and rates

/** Settings screen for currency configuration. */
function Settings() {
  // UI state for the exchange URL input and feedback snackbar
  const [exchangeUrl, setExchangeUrlState] = useState('');
  const [ratesSnapshot, setRatesSnapshot] = useState(getExchangeRates());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load current settings and refresh rates on mount
  useEffect(() => {
    // Load current settings
    setExchangeUrlState(getExchangeUrl());
    // Also fetch latest rates for display
    (async () => {
      try {
        const latest = await fetchExchangeRates();
        setRatesSnapshot(latest);
      } catch (_) {
        // ignore
      }
    })();
  }, []);
  // On mount, populate the input from persisted configuration

  /** Updates the exchange rates URL input. */
  const handleUrlChange = (event) => {
    setExchangeUrlState(event.target.value);
  };

  /** Persists the exchange rates URL and refreshes current rates snapshot. */
  const handleSaveSettings = () => {
    try {
      setExchangeUrl(exchangeUrl);
      
      // Immediately try fetching from the new URL so the UI reflects new rates
      fetchExchangeRates().then((latest) => {
        setRatesSnapshot(latest);
      }).catch(() => {});

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

  /** Tests connectivity to the configured exchange URL. */
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

  /** Closes the feedback snackbar. */
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Rates snapshot is displayed read-only for user awareness

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Configure your currency exchange rate settings and application preferences.
      </Typography>

      {/* Section: configure URL used to fetch exchange rates */}
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

        {/* Section: show the currently loaded exchange rates */}
        <Typography variant="h6" gutterBottom>
          Current Exchange Rates
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Current exchange rates being used by the application:
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          {Object.entries(ratesSnapshot).map(([currency, rate]) => (
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

      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Paper>
  );
}

export default Settings;
