import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Snackbar, Alert, Box } from '@mui/material';
import SavingsGoal from './SavingsGoal';
import { db, auth } from './firebase';
import { Bar } from 'react-chartjs-2';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

// Register Chart.js components for usage in the Bar chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // State variables for paycheck, expenses, savings goal, and notifications
  const [paycheck, setPaycheck] = useState(0); // Store the paycheck amount
  const [expenses, setExpenses] = useState([0, 0, 0, 0, 0]);  // Initialize expenses as an array of zeros
  const [savingsGoal, setSavingsGoal] = useState(0);  // Store the savings goal amount
  const [openSavingsGoal, setOpenSavingsGoal] = useState(false); // State to control the savings goal modal visibility
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' }); // Notification state

  // Labels for different expense categories
  const expenseLabels = ['Food', 'Transport', 'Health', 'Entertainment', 'Miscellaneous'];

  // Get the current user's ID
  const userId = auth.currentUser?.uid;

  // Fetch existing user data from Firestore when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const docRef = doc(db, 'users', userId); // Reference to the user's document in Firestore
        const docSnap = await getDoc(docRef); // Get the document snapshot
        if (docSnap.exists()) {
          const data = docSnap.data(); // Fetch the data from the snapshot
          setPaycheck(data.paycheck || 0); // Set the paycheck amount or default to 0
          // Ensure expenses is always an array of numbers
          setExpenses(Array.isArray(data.expenses) ? data.expenses : [0, 0, 0, 0, 0]); // Set expenses, default to zeros if invalid
          setSavingsGoal(data.savingsGoal || 0);  // Set the savings goal or default to 0
        } else {
          // If the document doesn't exist, initialize with default values
          setExpenses([0, 0, 0, 0, 0]);
          setSavingsGoal(0);
        }
      }
    };
    fetchUserData(); // Call the fetch function
  }, [userId]);

  // Calculate the total expenses by summing up the expenses array
  const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr), 0);  

  // Handle notifications based on paycheck and expenses comparison
  const handleNotification = () => {
    if (paycheck > totalExpenses) {
      setNotification({ open: true, message: 'Great! Your paycheck covers your expenses 😄', severity: 'success' });
    } else {
      setNotification({ open: true, message: 'Oops! Expenses exceed your paycheck 😔', severity: 'error' });
    }
  };

  // Save user data to Firestore
  const handleSaveData = async () => {
    if (userId) {
      try {
        await setDoc(doc(db, 'users', userId), {
          paycheck,
          expenses,  // Save the expenses array
          savingsGoal,  // Save the savings goal
        });
        setNotification({ open: true, message: 'Data saved successfully!', severity: 'success' });
      } catch (error) {
        setNotification({ open: true, message: 'Failed to save data!', severity: 'error' });
      }
    }
  };

  // Handle user logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        window.location.href = '/'; // Redirect to the home page after logout
      })
      .catch((error) => {
        setNotification({ open: true, message: 'Failed to log out!', severity: 'error' });
      });
  };

  // Data for the Bar chart
  const data = {
    labels: [...expenseLabels, 'Savings Goal'],  // Labels for the chart include expense categories and savings goal
    datasets: [
      {
        label: 'Expenses & Savings',
        data: [...expenses, savingsGoal],  // Data includes expenses and the savings goal
        backgroundColor: ['#3f51b5', '#ff4081', '#4caf50', '#ff9800', '#9c27b0', '#000000'], // Colors for each bar
      },
    ],
  };

  return (
    <Box sx={{ padding: 4 }}> {/* Container with padding */}
      <Typography variant="h4" gutterBottom>Personal Finance Dashboard</Typography>

      {/* Input for paycheck */}
      <TextField
        label="Paycheck"
        type="number"
        value={paycheck}
        onChange={(e) => setPaycheck(Number(e.target.value))} // Update paycheck state
        fullWidth
        margin="normal"
      />

      {/* Input fields for each expense category */}
      {expenseLabels.map((label, index) => (
        <TextField
          key={label}
          label={label}
          type="number"
          value={expenses[index]}  // Match expense value by index
          onChange={(e) => {
            const newExpenses = [...expenses]; // Create a copy of the expenses array
            newExpenses[index] = Number(e.target.value);  // Update the correct index with new value
            setExpenses(newExpenses); // Update state with the new expenses array
          }}
          fullWidth
          margin="normal"
        />
      ))}

      {/* Button to open the savings goal modal */}
      <Button variant="contained" onClick={() => setOpenSavingsGoal(true)} sx={{ marginTop: 2 }}>
        Set Savings Goal
      </Button>
      {/* SavingsGoal modal for setting the savings goal */}
      <SavingsGoal open={openSavingsGoal} handleClose={() => setOpenSavingsGoal(false)} setGoal={setSavingsGoal} />

      {/* Notification for user feedback */}
      <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })}>
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>

      {/* Bar chart for displaying expenses and savings */}
      <Box sx={{ marginTop: 4 }}>
        <Bar data={data} />
      </Box>

      {/* Button to save user data */}
      <Button variant="contained" color="primary" onClick={handleSaveData} sx={{ marginTop: 2 }}>
        Save Data
      </Button>

      {/* Button to check financial status */}
      <Button variant="outlined" onClick={handleNotification} sx={{ marginTop: 2 }}>
        Check Finances
      </Button>

      {/* Button for logging out */}
      <Button variant="text" color="error" onClick={handleLogout} sx={{ marginTop: 2 }}>
        Logout
      </Button>
    </Box>
  );
};

export default Dashboard;