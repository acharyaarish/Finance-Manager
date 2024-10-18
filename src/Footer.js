import React from 'react';
import { Box, Link, Typography, Container } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Personal Finance Manager © 2024
        </Typography>
        <Box>
          <Link href="#" sx={{ mx: 1, color: 'inherit', textDecoration: 'none' }}>
            Terms & Conditions
          </Link>
          <Link href="#" sx={{ mx: 1, color: 'inherit', textDecoration: 'none' }}>
            Privacy Policy
          </Link>
          <Link href="#" sx={{ mx: 1, color: 'inherit', textDecoration: 'none' }}>
            Contact
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
