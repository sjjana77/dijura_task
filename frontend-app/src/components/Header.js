import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthToken } from '../slices/authSlice';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(clearAuthToken());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/react_task');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dijura MERN Stack - Janardh
        </Typography>
        {isAuthenticated ? (
          <>

            <Button
              color="inherit"
              component={Link}
              to="/react_task/books_catalog"
              sx={{ border: '1px solid #fff', marginRight: '20px' }}
            >
              Books Catalog
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/react_task/transactions"
              sx={{ border: '1px solid #fff', marginRight: '20px' }}
            >
              Transactions
            </Button>
            <Button
              color="inherit"
              sx={{ border: '1px solid #fff' }}
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Typography variant="h6" sx={{ marginRight: '20px' }}>
              {user.username} ({user.role})
            </Typography>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              component={Link}
              to="/react_task/"
              sx={{ border: '1px solid #fff', marginRight: '20px' }}
            >
              Login
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/react_task/register"
              sx={{ border: '1px solid #fff' }}
            >
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
