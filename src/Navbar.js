// src/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Placeholder for Logo linking to Login */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Personal Finance Manager
          </Typography>
        </Link>
        {/* You can add an actual logo image here */}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
