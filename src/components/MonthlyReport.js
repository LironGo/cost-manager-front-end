/**
 * MonthlyReport component
 * Generates and displays a table report for a selected month and year.
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { getReport } from '../utils/idb';
import { convertCurrency } from '../services/currencyService';
import FeedbackSnackbar from './FeedbackSnackbar';
// getReport reads costs for the given month; convertCurrency normalizes totals

/**
 * UI for generating a monthly costs report.
 */
function MonthlyReport() {
  // Local UI state: form inputs, fetched report, loading, and feedback
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    currency: 'USD'
  });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Supported currency codes exposed to the currency dropdown
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
  // Pre-defined months/currencies drive dropdowns and avoid magic numbers

  /** Updates report form state for controlled inputs. */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /** Fetches data and prepares the monthly report. */
  const handleGenerateReport = async () => {
    // Indicate loading state to disable actions and show spinner
    setLoading(true);
    
    try {
      // Fetch raw data and convert sums to selected currency if required
      const rawReport = await getReport(formData.year, formData.month, formData.currency);
      
      // Convert currencies if needed
      const convertedReport = await convertCurrency(rawReport, formData.currency);
      
      setReport(convertedReport);
      
      // Notify user that the report is ready
      setSnackbar({
        open: true,
        message: 'Report generated successfully!',
        severity: 'success'
      });
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error generating report: ${error.message}`,
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
        Monthly Report
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Generate a detailed report for a specific month and year in your preferred currency.
      </Typography>

      {/* Controls to pick year, month, and currency */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            label="Year"
          >
            {/* Generate a rolling 10-year range centered around current year */}
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

        {/* Generate triggers data retrieval and currency conversion */}
        <Button
          variant="contained"
          onClick={handleGenerateReport}
          disabled={loading}
          sx={{ minWidth: 150 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Report'}
        </Button>
      </Box>

      {/* When data exists, render the summary and the detailed table */}
      {report && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Report for {months[formData.month - 1].label} {formData.year}
          </Typography>
          
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            {/* Format totals with two decimal places for consistency */}
            Total: {report.total.total.toFixed(2)} {report.total.currency}
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Sum</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Render each cost item as a row in the table */}
                {report.costs.map((cost, index) => (
                  <TableRow key={index}>
                    <TableCell>{cost.Date.day}</TableCell>
                    <TableCell>{cost.sum.toFixed(2)}</TableCell>
                    <TableCell>{cost.currency}</TableCell>
                    <TableCell>{cost.category}</TableCell>
                    <TableCell>{cost.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Centralized feedback notifications for async operations */}
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Paper>
  );
}

export default MonthlyReport;
