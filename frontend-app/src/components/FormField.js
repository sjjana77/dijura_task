import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const FormField = ({ type, label, name, value, onChange, error, helperText, options }) => (
    <TextField
        fullWidth
        type={type}
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        margin="normal"
        error={!!error}
        helperText={helperText}
        variant="outlined"
        select={type === 'select'}
    >
        {options && options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
        ))}
    </TextField>
);

export default FormField;
