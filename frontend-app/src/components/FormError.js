import React from 'react';
import { Typography } from '@mui/material';

const FormError = ({ error }) => {
  return error ? <Typography color="error">{error}</Typography> : null;
};

export default FormError;
