import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Grid, Paper, Button } from '@mui/material';
import BookForm from './BookForm';
import FormError from './FormError';
import LoadingButton from './LoadingButton';

const AddOrEditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    author: '',
    available: true,
    count: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({
    title: '',
    author: '',
    count: ''
  });

  // Fetch token from local storage
  const token = localStorage.getItem('token');

  useEffect(() => {
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
              .catch(() => {
                setError('Error fetching transaction details');
                setLoading(false);
              });
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Error fetching book details');
          setLoading(false);
        });
    }
  }, [id, token]);

  // Form Validation
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

    if (!book.count) {
      errors.count = 'Count is required';
      isValid = false;
    }

    if (book.count < 1) {
      errors.count = 'Count should be at least 1';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "user_id" && value !== "") {
      setBook(prevState => ({
        ...prevState,
        [name]: value, available: false
      }));
    } else {
      setBook(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
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

    const request = id
      ? axios.put(`${process.env.REACT_APP_API_URL}books/${id}`, book, config)
      : axios.post(`${process.env.REACT_APP_API_URL}books`, book, config);

    request
      .then(() => {
        setLoading(false);
        navigate('/react_task/books_catalog');
      })
      .catch(() => {
        setError(id ? 'Error updating book' : 'Error adding book');
        setLoading(false);
      });
  };

  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Edit Book' : 'Add Book'}
        </Typography>
        <FormError error={error} />
        <form onSubmit={handleSubmit}>
          <BookForm book={book} errors={errors} handleChange={handleChange} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <LoadingButton
                loading={loading}
                text={id ? 'Update Book' : 'Add Book'}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                component={Link}
                to="/react_task/books_catalog/"
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
