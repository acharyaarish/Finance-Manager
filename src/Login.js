import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Link,
  CircularProgress,
} from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);

      // Fetch user data from Firestore after login
      const userId = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (userDoc.exists()) {
        // You can handle the retrieved user data here if needed
        console.log('User data:', userDoc.data());
      } else {
        console.log('No such user data!');
      }

      // Navigate to the dashboard or desired route
      navigate('/dashboard');
    } catch (error) {
      setError('Login error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Container
      maxWidth="xs"
      style={{
        marginTop: '100px',
        background: '#ffffff',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box textAlign="center">
        <Typography
          variant="h4"
          gutterBottom
          style={{
            color: '#333333',
            fontWeight: '600',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Login
        </Typography>
        {error && (
          <Typography
            color="error"
            variant="body2"
            style={{
              marginBottom: '15px',
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {error}
          </Typography>
        )}
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          style={{
            marginTop: '20px',
            background: '#00796B',
            color: '#ffffff',
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>
        <Link
          onClick={() => navigate('/signup')}
          variant="body2"
          style={{
            display: 'block',
            marginTop: '10px',
            color: '#00796B',
            cursor: 'pointer',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Don't have an account? Sign up
        </Link>
      </Box>
    </Container>
  );
}

export default Login;
