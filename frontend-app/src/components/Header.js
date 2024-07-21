import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static" sx={{ marginBottom: '20px' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Anhas MERN Stack Task - Janardh
        </Typography>
        <Button component={Link} to="/react_task/" color="inherit" sx={{ border: '1px solid #fff', marginRight: '8px' }}>Login</Button>
        <Button component={Link} to="/react_task/register" color="inherit" sx={{ border: '1px solid #fff', marginRight: '8px' }}>Register</Button>
        <Button component={Link} to="/react_task/transactions" color="inherit" sx={{ border: '1px solid #fff', marginRight: '8px' }}>Transactions</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
