import React from 'react';
import { Snackbar, Alert } from '@mui/material';

function FeedbackSnackbar(props) {
  const { open, message, severity, onClose, autoHideDuration = 6000 } = props;
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose}>
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default FeedbackSnackbar;


