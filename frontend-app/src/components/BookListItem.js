import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BookIcon from '@mui/icons-material/Book';
import { useNavigate } from 'react-router-dom';

const BookListItem = ({ book, userRole, handleRemoveBook }) => {
  const navigate = useNavigate();

  return (
    <ListItem onClick={() => navigate(`/react_task/books/borrow-return/${book._id}`)} style={{ cursor: 'pointer' }}>
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
  );
};

export default BookListItem;
