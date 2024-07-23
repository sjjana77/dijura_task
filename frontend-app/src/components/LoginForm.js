import React from 'react';
import { Container, Typography, Button, Grid, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import useLoginForm from './useLoginForm';

const LoginForm = () => {
    const { loginCredentials, errors, handleChange, handleSubmit } = useLoginForm();

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    type='email'
                    label="Email"
                    name="email_id"
                    value={loginCredentials.email_id}
                    onChange={handleChange}
                    margin="normal"
                    error={!!errors.email_id}
                    helperText={errors.email_id}
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    type='password'
                    label="Password"
                    name="password"
                    value={loginCredentials.password}
                    onChange={handleChange}
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password}
                    variant="outlined"
                />
                <Grid container spacing={2}>
                    <Grid item xs={7}>
                        <ErrorMessage message={errors.server} />
                        <Button
                            component={Link}
                            to="/react_task/register/"
                            variant="contained"
                            color="primary"
                            style={{ marginTop: 16, marginBottom: 16, float: 'right' }}
                        >
                            Register
                        </Button>
                        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 16, marginBottom: 16, float: 'right', marginRight: 16 }}>
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default LoginForm;
