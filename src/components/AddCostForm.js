/**
 * AddCostForm component
 * Lets users add a new cost item and persists it to IndexedDB.
 */
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { addCost } from '../utils/idb';

/**
 * Form for creating a new cost entry.
 */
const AddCostForm = () => {
  const [formData, setFormData] = useState({
    sum: '',
    currency: 'USD',
    category: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const currencies = ['USD', 'ILS', 'GBP', 'EURO'];
  const categories = [
    'FOOD',
    'TRANSPORTATION',
    'ENTERTAINMENT',
    'EDUCATION',
    'HEALTHCARE',
    'SHOPPING',
    'UTILITIES',
    'OTHER'
  ];

  /** Updates form state for controlled inputs. */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /** Handles form submission, validation, and saving. */
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate form
    if (!formData.sum || !formData.category || !formData.description) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    if (isNaN(formData.sum) || parseFloat(formData.sum) <= 0) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid positive number for the sum',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    
    try {
      const costData = {
        sum: parseFloat(formData.sum),
        currency: formData.currency,
        category: formData.category,
        description: formData.description
      };

      const result = await addCost(costData);
      
      setSnackbar({
        open: true,
        message: 'Cost item added successfully!',
        severity: 'success'
      });

      // Reset form
      setFormData({
        sum: '',
        currency: 'USD',
        category: '',
        description: ''
      });
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error adding cost item: ${error.message}`,
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
        Add New Cost Item
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Add a new expense to your cost manager. The date will be automatically set to today.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <TextField
          fullWidth
          label="Sum *"
          name="sum"
          type="number"
          value={formData.sum}
          onChange={handleInputChange}
          margin="normal"
          required
          inputProps={{ min: 0, step: 0.01 }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Currency *</InputLabel>
          <Select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            label="Currency *"
          >
            {currencies.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Category *</InputLabel>
          <Select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            label="Category *"
            required
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Description *"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          margin="normal"
          required
          multiline
          rows={3}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? 'Adding...' : 'Add Cost Item'}
        </Button>
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

export default AddCostForm;
