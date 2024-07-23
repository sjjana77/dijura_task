import React from 'react';
import { Grid, TextField, FormControlLabel, Switch } from '@mui/material';

const BookForm = ({ book, errors, handleChange }) => {
  return (
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
        <TextField
          type='number'
          fullWidth
          label="Count"
          name="count"
          value={book.count}
          onChange={handleChange}
          variant="outlined"
          error={Boolean(errors.count)}
          helperText={errors.count}
        />
      </Grid>
    </Grid>
  );
};

export default BookForm;
