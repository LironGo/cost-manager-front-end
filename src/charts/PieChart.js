/**
 * PieChart component
 * Displays category breakdown for a selected month using a pie chart.
 */
import React, { useState, useEffect } from 'react';
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
// Recharts primitives used to render a responsive pie chart
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getReport } from '../utils/idb';
import { convertCurrency } from '../services/currencyService';
import FeedbackSnackbar from '../components/FeedbackSnackbar';
// getReport reads monthly costs; convertCurrency normalizes values for charting

/** Renders a pie chart of costs grouped by category. */
function PieChart() {
  // State holds user selections, generated chart data, and UI flags
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    currency: 'USD'
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const currencies = ['USD', 'ILS', 'GBP', 'EURO'];
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];
  // Months list powers the month dropdown labels/values

  // Colors for pie chart segments
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];
  // Fixed palette cycles through categories deterministically

  /** Updates control state for chart inputs. */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /** Builds pie data by grouping costs by category. */
  const generateChart = async () => {
    setLoading(true);
    
    try {
      // Build report and aggregate sums per category
      const report = await getReport(formData.year, formData.month, formData.currency);
      const convertedReport = await convertCurrency(report, formData.currency);
      
      // Group costs by category
      const categoryTotals = {};
      convertedReport.costs.forEach(cost => {
        if (categoryTotals[cost.category]) {
          categoryTotals[cost.category] += cost.sum;
        } else {
          categoryTotals[cost.category] = cost.sum;
        }
      });
      
      // Convert to chart data format
      const data = Object.entries(categoryTotals).map(([category, value], index) => ({
        name: category,
        value: parseFloat(value.toFixed(2)),
        fill: colors[index % colors.length]
      }));
      
      setChartData(data);
      
      // Notify user chart is ready
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
        Pie Chart - Costs by Category
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        View your spending breakdown by category for a specific month and year.
      </Typography>

      {/* Controls row: year, month, currency selectors and action button */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            label="Year"
          >
            {/* Rolling 10-year range centered around current year */}
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Month picker bound to controlled state */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Month</InputLabel>
          <Select
            name="month"
            value={formData.month}
            onChange={handleInputChange}
            label="Month"
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Currency picker controls units displayed in the chart */}
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
          {/* Show spinner while generating; disable button to prevent repeats */}
          {loading ? <CircularProgress size={24} /> : 'Generate Chart'}
        </Button>
      </Box>

      {chartData.length > 0 && (
        <Box sx={{ height: 400, width: '100%' }}>
          {/* Responsive container ensures the chart adapts to parent size */}
          <ResponsiveContainer width="100%" height="100%">
            {/* Recharts pie chart with legend and tooltip */}
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                /* Pie size (radius) for consistent layout */
                outerRadius={80}
                fill="#8884d8"
                /* Use the numeric 'value' field from each datum */
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              {/* Tooltip shows absolute amounts with the selected currency */}
              <Tooltip formatter={(value) => [`${value} ${formData.currency}`, 'Amount']} />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </Box>
      )}

      {/* Empty state when there's no data for the selected period */}
      {chartData.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No data available for the selected period. Add some cost items or try a different month/year.
          </Typography>
        </Box>
      )}

      {/* Snackbar for success/error while generating chart */}
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Paper>
  );
}

export default PieChart;
