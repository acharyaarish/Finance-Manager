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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { setDoc, doc } from 'firebase/firestore';

function SignUp({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setLoading(true);
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);

      // Save user data in Firestore
      const userId = userCredential.user.uid;
      await setDoc(doc(db, 'users', userId), {
        email: email,
        expenses: [],
        savingsGoals: [],
      });

      // Navigate to the dashboard or desired route
      navigate('/dashboard');
    } catch (error) {
      setError('Signup error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignUp();
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
          Sign Up
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
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
        </Button>
        <Link
          onClick={() => navigate('/')}
          variant="body2"
          style={{
            display: 'block',
            marginTop: '10px',
            color: '#00796B',
            cursor: 'pointer',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Already have an account? Log in
        </Link>
      </Box>
    </Container>
  );
}

export default SignUp;
