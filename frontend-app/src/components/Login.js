// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../slices/authSlice';

export default function Login() {
    const navigate = useNavigate();
    const [loginCredentials, setLoginCredentials] = useState({
        email_id: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email_id: '',
        password: '',
        server: ''
    });

    const dispatch = useDispatch();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginCredentials({ ...loginCredentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formValid = true;

        if (!loginCredentials.email_id) {
            setErrors((prevErrors) => ({ ...prevErrors, email_id: 'Email is required' }));
            formValid = false;
        } else if (!validateEmail(loginCredentials.email_id)) {
            setErrors((prevErrors) => ({ ...prevErrors, email_id: 'Invalid Email Format' }));
            formValid = false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, email_id: '' }));
        }

        if (!loginCredentials.password) {
            setErrors((prevErrors) => ({ ...prevErrors, password: 'Password is required' }));
            formValid = false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
        }

        if (formValid) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}users/login`, loginCredentials);
                const { token, user } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                dispatch(setAuthToken({ token, user }));

                setErrors((prevErrors) => ({ ...prevErrors, server: '' }));
                navigate('/react_task/books_catalog/');
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'An unexpected error occurred';
                setErrors((prevErrors) => ({ ...prevErrors, server: errorMessage }));
                console.error('Login error:', error); // Debug log
            }
        }
    };

    useEffect(() => {
        localStorage.clear();
    }, [])

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
                        {errors.server && (
                            <Typography style={{ color: 'red' }} gutterBottom>
                                {errors.server}
                            </Typography>
                        )}

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
    )
}
