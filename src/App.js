import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/material'; // Import Box for flexbox layout
import Login from './Login';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import Footer from './Footer';
import Navbar from './Navbar';  // Import simplified Navbar

const theme = createTheme({
  palette: {
    primary: { main: '#1D71BA' },  // Light Blue
    secondary: { main: '#EDC400' }, // Yellow
  },
  typography: {
    h4: { fontWeight: 600 },
    body1: { color: '#555' },
  },
});

function App() {
  const [user, setUser] = useState(null); // Manage user login state

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh', // Ensure the container takes the full height of the viewport
          }}
        >
          <Navbar />  {/* Simplified Navbar with just logo and heading */}
          <Box component="main" sx={{ flex: 1 }}>
            <Routes>
              {/* Login route */}
              <Route path="/" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
              
              {/* SignUp route */}
              <Route path="/signup" element={!user ? <SignUp setUser={setUser} /> : <Navigate to="/dashboard" />} />

              {/* Dashboard route (only accessible after login) */}
              <Route path="/dashboard" element={user ? <Dashboard setUser={setUser} /> : <Navigate to="/" />} />
            </Routes>
          </Box>
          <Footer /> {/* Footer will be at the bottom */}
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
