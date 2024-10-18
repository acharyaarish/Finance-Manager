import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';

function SavingsGoal({ open, handleClose, setGoal }) {
  const [goal, setGoalValue] = useState(0);

  const handleSaveGoal = () => {
    setGoal(goal);
    setGoalValue(0); // Reset the goal input
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Set Savings Goal</DialogTitle>
      <DialogContent>
        <TextField
          label="Savings Goal Amount"
          type="number"
          value={goal}
          onChange={(e) => setGoalValue(Number(e.target.value))}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSaveGoal} color="primary">
          Save Goal
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SavingsGoal;
