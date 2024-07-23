import React from 'react';
import { List } from '@mui/material';
import BookListItem from './BookListItem';

const BookList = ({ books, userRole, handleRemoveBook }) => {
  return (
    <List>
      {books.map((book) => (
        <BookListItem
          key={book._id}
          book={book}
          userRole={userRole}
          handleRemoveBook={handleRemoveBook}
        />
      ))}
    </List>
  );
};

export default BookList;
