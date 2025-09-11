/**
 * BarChart component
 * Shows monthly totals for a selected year using a bar chart.
 */
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getReport } from '../utils/idb';
import { convertCurrency } from '../services/currencyService';
// Utilities provide monthly reports and currency normalization for totals

/** Renders a bar chart of monthly totals for the selected year. */
const BarChart = () => {
  // State holds user selections, built chart data, and UI flags
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    currency: 'USD'
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const currencies = ['USD', 'ILS', 'GBP', 'EURO'];
  const months = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Feb' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' },
    { value: 5, label: 'May' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Aug' },
    { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dec' }
  ];

  /** Updates control state for chart inputs. */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /** Builds chart data by aggregating per-month totals. */
  const generateChart = async () => {
    setLoading(true);
    
    try {
      const monthlyData = [];
      
      // Get data for all 12 months
      for (let month = 1; month <= 12; month++) {
        try {
          // Generate report per month and convert totals to selected currency
          const report = await getReport(formData.year, month, formData.currency);
          const convertedReport = await convertCurrency(report, formData.currency);
          
          monthlyData.push({
            month: months[month - 1].label,
            total: convertedReport.total.total
          });
        } catch (error) {
          // If no data for this month, add 0
          monthlyData.push({
            month: months[month - 1].label,
            total: 0
          });
        }
      }
      
      setChartData(monthlyData);
      
      // Notify user that chart data is ready
      setSnackbar({
        open: true,
        message: 'Chart generated successfully!',
        severity: 'success'
      });
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error generating chart: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  /** Closes the feedback snackbar. */
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bar Chart - Monthly Costs
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        View your total spending for each month of a selected year.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            label="Year"
          >
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Currency</InputLabel>
          <Select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            label="Currency"
          >
            {currencies.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={generateChart}
          disabled={loading}
          sx={{ minWidth: 150 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Chart'}
        </Button>
      </Box>

      {chartData.length > 0 && (
        <Box sx={{ height: 400, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toFixed(2)} ${formData.currency}`, 'Total']} />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </Box>
      )}

      {chartData.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No data available for the selected year. Add some cost items or try a different year.
          </Typography>
        </Box>
      )}

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

export default BarChart;
