import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Box,
  Card,
  Grid,
  Tooltip,
  IconButton,
  LinearProgress,
  Divider,
  Stack,
} from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';
import SavingsGoal from './SavingsGoal';
import { db, auth } from './firebase';
import { Bar } from 'react-chartjs-2';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { lightTheme, darkTheme } from './themes';
import FoodIcon from '@mui/icons-material/Fastfood';
import TransportIcon from '@mui/icons-material/DirectionsCar';
import HealthIcon from '@mui/icons-material/LocalHospital';
import EntertainmentIcon from '@mui/icons-material/Movie';
import MiscIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

// Styled button with animation for modern button effects
const ModernButton = styled(Button)(({ theme }) => ({
  transition: 'transform 0.2s, background-color 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: theme.palette.primary.dark,
  },
}));

const Dashboard = () => {
  const [paycheck, setPaycheck] = useState(0);
  const [expenses, setExpenses] = useState([0, 0, 0, 0, 0]);
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [openSavingsGoal, setOpenSavingsGoal] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [theme, setTheme] = useState('light');

  const expenseLabels = useMemo(
    () => [
      { label: 'Food', icon: <FoodIcon /> },
      { label: 'Transport', icon: <TransportIcon /> },
      { label: 'Health', icon: <HealthIcon /> },
      { label: 'Entertainment', icon: <EntertainmentIcon /> },
      { label: 'Miscellaneous', icon: <MiscIcon /> },
    ],
    []
  );

  const userId = auth.currentUser?.uid;
  const themeObject = useMemo(() => (theme === 'dark' ? darkTheme : lightTheme), [theme]);

  const totalExpenses = useMemo(() => expenses.reduce((acc, curr) => acc + Number(curr), 0), [expenses]);
  const savingsProgress = useMemo(() => (savingsGoal ? (totalExpenses / savingsGoal) * 100 : 0), [totalExpenses, savingsGoal]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPaycheck(data.paycheck || 0);
          setExpenses(Array.isArray(data.expenses) ? data.expenses : [0, 0, 0, 0, 0]);
          setSavingsGoal(data.savingsGoal || 0);
        }
      }
    };
    fetchUserData();
  }, [userId]);

  const handleNotification = useCallback(() => {
    const isSuccess = paycheck > totalExpenses;
    setNotification({
      open: true,
      message: isSuccess ? 'Great! Your paycheck covers your expenses 😄' : 'Oops! Expenses exceed your paycheck 😔',
      severity: isSuccess ? 'success' : 'error',
    });
  }, [paycheck, totalExpenses]);

  const handleSaveData = useCallback(async () => {
    if (userId) {
      try {
        await setDoc(doc(db, 'users', userId), {
          paycheck,
          expenses,
          savingsGoal,
        });
        setNotification({ open: true, message: 'Data saved successfully!', severity: 'success' });
      } catch (error) {
        setNotification({ open: true, message: 'Failed to save data!', severity: 'error' });
      }
    }
  }, [userId, paycheck, expenses, savingsGoal]);

  const handleLogout = useCallback(() => {
    signOut(auth)
      .then(() => (window.location.href = '/'))
      .catch(() => setNotification({ open: true, message: 'Failed to log out!', severity: 'error' }));
  }, []);

  const data = useMemo(() => ({
    labels: [...expenseLabels.map((e) => e.label), 'Savings Goal'],
    datasets: [
      {
        label: 'Expenses & Savings',
        data: [...expenses, savingsGoal],
        backgroundColor: ['#3f51b5', '#ff4081', '#4caf50', '#ff9800', '#9c27b0', '#000000'],
      },
    ],
  }), [expenses, savingsGoal, expenseLabels]);

  return (
    <ThemeProvider theme={themeObject}>
      <Box sx={{ paddingX: 4, paddingBottom: 4, backgroundColor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
        
        {/* Theme Toggle and Logout positioned for usability */}
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Tooltip title="Toggle Theme">
            <IconButton onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}>
              <Brightness4Icon sx={{ fontSize: 28, color: theme === 'light' ? 'primary.main' : 'secondary.main' }} />
            </IconButton>
          </Tooltip>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'error.main' }}>Logout</Typography>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} color="error">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Monthly Income Section */}
        <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>Monthly Income</Typography>
        <Card sx={{ padding: 3, marginBottom: 3, backgroundColor: 'background.paper', boxShadow: 3 }}>
          <TextField
            label="Paycheck"
            type="number"
            value={paycheck}
            onChange={(e) => setPaycheck(Number(e.target.value))}
            fullWidth
            margin="normal"
          />
        </Card>

        {/* Expenses Section */}
        <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>Expenses</Typography>
        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
          {expenseLabels.map(({ label, icon }, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={label}>
              <Card
                sx={{
                  padding: 2,
                  backgroundColor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: 1,
                }}
              >
                <Tooltip title={label}>
                  <IconButton edge="start" sx={{ marginRight: 1, color: 'primary.main' }}>{icon}</IconButton>
                </Tooltip>
                <TextField
                  label={label}
                  type="number"
                  value={expenses[index]}
                  onChange={(e) => {
                    const newExpenses = [...expenses];
                    newExpenses[index] = Number(e.target.value);
                    setExpenses(newExpenses);
                  }}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <ModernButton
          variant="contained"
          onClick={() => setOpenSavingsGoal(true)}
          sx={{ marginBottom: 2, backgroundColor: 'primary.main', color: 'white' }}
        >
          Set Savings Goal
        </ModernButton>
        <SavingsGoal open={openSavingsGoal} handleClose={() => setOpenSavingsGoal(false)} setGoal={setSavingsGoal} />

        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          <Alert severity={notification.severity}>{notification.message}</Alert>
        </Snackbar>

        <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ marginBottom: 1, fontWeight: 'bold' }}>Savings Progress</Typography>
          <LinearProgress
            variant="determinate"
            value={savingsProgress}
            sx={{ height: 12, borderRadius: 5, width: '80%', backgroundColor: 'grey.300', color: 'primary.main' }}
          />
          <Typography variant="caption" sx={{ marginTop: 1 }}>{Math.round(savingsProgress)}% of Savings Goal</Typography>
        </Box>

        <Box sx={{ maxWidth: '100%', overflowX: 'auto', marginBottom: 2 }}>
          <Bar data={data} options={{ responsive: true, maintainAspectRatio: false, aspectRatio: 2 }} />
        </Box>

        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={6}>
            <ModernButton variant="contained" color="primary" onClick={handleSaveData} fullWidth>
              Save Data
            </ModernButton>
          </Grid>
          <Grid item xs={6}>
            <ModernButton variant="outlined" color="primary" onClick={handleNotification} fullWidth>
              Check Finances
            </ModernButton>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
