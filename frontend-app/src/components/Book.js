import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper, Grid } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BookIcon from '@mui/icons-material/Book'; // Import Book icon

const Book = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    available: true,
  });
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const userRole = user?.role;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${process.env.REACT_APP_API_URL}books`, config);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      if (error.response && error.response.status === 401) {
        // Unauthorized, redirect to login
        navigate('/react_task/');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleAddBook = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(`${process.env.REACT_APP_API_URL}books`, newBook, config);
      setNewBook({ title: '', author: '', available: true });
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      if (error.response && error.response.status === 403) {
        // Forbidden, user doesn't have permission
        alert('You do not have permission to add books.');
      }
    }
  };

  const handleRemoveBook = async (bookId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${process.env.REACT_APP_API_URL}books/${bookId}`, config);
      fetchBooks();
    } catch (error) {
      console.error('Error removing book:', error);
      if (error.response && error.response.status === 403) {
        // Forbidden, user doesn't have permission
        alert('You do not have permission to remove books.');
      }
    }
  };

  return (
    <Container maxWidth="md" style={{ padding: '20px' }}>
      <Paper style={{ padding: '20px' }}>
        <Grid container spacing={3} sx={{ marginBottom: "10px" }}>
          <Grid item xs={6}>
            <Typography variant="h4" gutterBottom>
              Book Management
            </Typography>
          </Grid>
          <Grid item xs={6}>
            {userRole === 'admin' && (
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/react_task/books/add"
                style={{ marginBottom: '16px' }}
              >
                Add New Book
              </Button>
            )}
          </Grid>
        </Grid>
        <List>
          {books.map((book) => (
            <ListItem
              key={book._id}
              secondaryAction={
                userRole === 'admin' && (
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => navigate(`/react_task/books/edit/${book._id}`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveBook(book._id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="borrow-return" onClick={() => navigate(`/react_task/books/borrow-return/${book._id}`)}>
                      <BookIcon />
                    </IconButton>
                  </>
                )
              }
            >
              <ListItemText
                primary={`${book.title} by ${book.author}`}
                secondary={book.available ? 'Available' : 'Unavailable'}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Book;
