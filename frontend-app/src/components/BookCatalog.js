import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BookIcon from '@mui/icons-material/Book';

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
      setFilteredBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      if (error.response && error.response.status === 401) {
        navigate('/react_task/');
      }
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterBooks(query);
  };

  const filterBooks = (query) => {
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
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
        alert('You do not have permission to remove books.');
      }
    }
  };

  const handleListItemClick = (bookId) => {
    navigate(`/react_task/books/borrow-return/${bookId}`);
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
        <TextField
          fullWidth
          label="Search Books"
          value={searchQuery}
          onChange={handleSearchChange}
          margin="normal"
          variant="outlined"
        />
        <List>
          {filteredBooks.map((book) => (
            <ListItem
              key={book._id}
              onClick={() => handleListItemClick(book._id)}
              style={{ cursor: 'pointer' }}
            >
              <ListItemText
                primary={`${book.title} by ${book.author}`}
                secondary={book.available ? 'Available' : 'Unavailable'}
              />
              {userRole === 'admin' && (
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={(e) => { e.stopPropagation(); navigate(`/react_task/books/edit/${book._id}`); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); handleRemoveBook(book._id); }}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="borrow-return" onClick={(e) => { e.stopPropagation(); navigate(`/react_task/books/borrow-return/${book._id}`); }}>
                    <BookIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default BookCatalog;
