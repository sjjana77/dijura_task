import React from 'react';
import { Button, CircularProgress } from '@mui/material';

const LoadingButton = ({ loading, text, ...props }) => {
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={loading}
      style={{ marginTop: '16px' }}
      {...props}
    >
      {loading ? <CircularProgress size={24} /> : text}
    </Button>
  );
};

export default LoadingButton;
