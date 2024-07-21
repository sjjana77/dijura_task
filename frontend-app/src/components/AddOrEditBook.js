import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Grid, CircularProgress, Paper, FormControlLabel, Switch, MenuItem, Select, InputLabel, FormControl, InputAdornment } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const AddOrEditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    author: '',
    available: true,
    user_id: '',
    due_date: null
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({
    title: '',
    author: ''
  });

  // Fetch the token from local storage
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch users for the dropdown
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}users/get_users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching users');
        setLoading(false);
      });

    // Fetch book data if id is present (edit functionality)
    if (id) {
      setLoading(true);
      axios.get(`${process.env.REACT_APP_API_URL}books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setBook(response.data);
          if (response.data.transactionId) {
            axios.get(`${process.env.REACT_APP_API_URL}transactions/${response.data.transactionId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
              .then(response => {
                setBook(prev => ({
                  ...prev,
                  user_id: response.data.userId,
                  due_date: response.data.dueDate ? new Date(response.data.dueDate) : null
                }));
              })
              .catch(error => {
                setError('Error fetching transaction details');
                setLoading(false);
              });
          }
          setLoading(false);
        })
        .catch(error => {
          setError('Error fetching book details');
          setLoading(false);
        });
    }

  }, [id, token]);

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!book.title) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!book.author) {
      errors.author = 'Author is required';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBook(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateChange = (date) => {
    setBook(prevState => ({
      ...prevState,
      due_date: date
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    if (id) {
      // Edit book
      axios.put(`${process.env.REACT_APP_API_URL}books/${id}`, book, config)
        .then(response => {
          setLoading(false);
          navigate('/react_task/books');
        })
        .catch(error => {
          setError('Error updating book');
          setLoading(false);
        });
    } else {
      // Add new book
      axios.post(`${process.env.REACT_APP_API_URL}books`, book, config)
        .then(response => {
          setLoading(false);
          navigate('/react_task/books');
        })
        .catch(error => {
          setError('Error adding book');
          setLoading(false);
        });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Edit Book' : 'Add Book'}
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={book.title}
                onChange={handleChange}
                variant="outlined"
                error={Boolean(errors.title)}
                helperText={errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Author"
                name="author"
                value={book.author}
                onChange={handleChange}
                variant="outlined"
                error={Boolean(errors.author)}
                helperText={errors.author}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="available"
                    checked={book.available}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Available"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>User</InputLabel>
                <Select
                  name="user_id"
                  value={book.user_id || ''}
                  onChange={handleChange}
                  label="User"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={book.due_date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                style={{ marginTop: '16px' }}
              >
                {loading ? <CircularProgress size={24} /> : id ? 'Update Book' : 'Add Book'}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                component={Link}
                to="/react_task/books/"
                variant="contained"
                color="primary"
                style={{ marginTop: '16px' }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddOrEditBook;
