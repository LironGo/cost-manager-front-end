// Lightweight wrapper around MUI Snackbar + Alert for app-wide feedback
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

// Displays transient messages with severity (success, info, warning, error)
function FeedbackSnackbar(props) {
  // Destructure props; allow overriding auto-hide duration if needed
  const { open, message, severity, onClose, autoHideDuration = 6000 } = props;
  return (
    // Snackbar handles timing/placement; Alert renders the visual style
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose}>
      {/* Severity controls color/icon; close forwards to parent handler */}
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}

// Default export for easy import across components
export default FeedbackSnackbar;


