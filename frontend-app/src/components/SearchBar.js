import React from 'react';
import { TextField } from '@mui/material';

const SearchBar = ({ searchQuery, handleSearchChange }) => {
  return (
    <TextField
      fullWidth
      label="Search Books"
      value={searchQuery}
      onChange={handleSearchChange}
      margin="normal"
      variant="outlined"
    />
  );
};

export default SearchBar;
