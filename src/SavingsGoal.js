import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

function SavingsGoal({ open, handleClose, setGoal }) {
  const [goal, setGoalValue] = useState('');
  const [error, setError] = useState(false);

  const handleSaveGoal = () => {
    if (goal > 0) {
      setGoal(goal); // Set the goal if valid
      setGoalValue(''); // Reset the input field after saving
      setError(false); // Clear any error state
      handleClose(); // Close the dialog
    } else {
      setError(true); // Trigger error if the goal is invalid
    }
  };

  const handleChange = (e) => {
    const value = Number(e.target.value);
    setGoalValue(value);
    if (value <= 0) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Set Savings Goal
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mt: 1 }}>
          <TextField
            label="Savings Goal Amount"
            type="number"
            value={goal}
            onChange={handleChange}
            fullWidth
            error={error}
            helperText={error ? 'Please enter a positive amount.' : ''}
            variant="outlined"
            autoFocus
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSaveGoal}
          color="primary"
          variant="contained"
          disabled={goal <= 0}
        >
          Save Goal
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SavingsGoal;
