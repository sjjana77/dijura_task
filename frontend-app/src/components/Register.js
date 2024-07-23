import React, { useState } from 'react';
import { Container, Typography, Button, Grid, TextField, MenuItem } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const [registerData, setRegisterData] = useState({
        name: '',
        email_id: '',
        mobile: '',
        role: '',
        password: ''
    });

    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        name: '',
        email_id: '',
        role: '',
        mobile: '',
        password: '',
        register_status: ''
    });

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formValid = true;

        // Create a copy of the errors object
        const newErrors = { ...errors };

        if (!registerData.name) {
            newErrors.name = 'Name is required';
            formValid = false;
        } else {
            newErrors.name = '';
        }

        if (!registerData.email_id) {
            newErrors.email_id = 'Email is required';
            formValid = false;
        } else if (!validateEmail(registerData.email_id)) {
            newErrors.email_id = 'Invalid Email Format';
            formValid = false;
        } else {
            newErrors.email_id = '';
        }

        if (!registerData.mobile) {
            newErrors.mobile = 'Mobile is required';
            formValid = false;
        } else if (!validatePhoneNumber(registerData.mobile)) {
            newErrors.mobile = 'Invalid mobile number';
            formValid = false;
        } else {
            newErrors.mobile = '';
        }

        if (!registerData.role) {
            newErrors.role = 'Role is required';
            formValid = false;
        } else {
            newErrors.role = '';
        }

        if (!registerData.password) {
            newErrors.password = 'Password is required';
            formValid = false;
        } else if (registerData.password.length < 8) {
            newErrors.password = 'Password should be greater than or equal to 8 characters';
            formValid = false;
        } else {
            newErrors.password = '';
        }

        setErrors(newErrors);

        if (formValid) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}users/register`, registerData);

                if (response.status === 200) {
                    // Clear the form
                    setRegisterData({
                        name: '',
                        email_id: '',
                        mobile: '',
                        role: '',
                        password: ''
                    });
                    navigate('/react_task/');
                } else {
                    console.log(response);
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        register_status: response.data.error
                    }));
                }
            } catch (error) {
                if (error.response) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        register_status: `Failed to register: ${error.response.data.message || 'Unknown error'}`
                    }));
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        register_status: `Failed to register: ${error.message}`
                    }));
                }
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" align="center" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    type='text'
                    label="Name"
                    name="name"
                    value={registerData.name}
                    onChange={handleChange}
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name}
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    type='email'
                    label="Email"
                    name="email_id"
                    value={registerData.email_id}
                    onChange={handleChange}
                    margin="normal"
                    error={!!errors.email_id}
                    helperText={errors.email_id}
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    type='number'
                    label="Mobile"
                    name="mobile"
                    value={registerData.mobile}
                    onChange={handleChange}
                    margin="normal"
                    error={!!errors.mobile}
                    helperText={errors.mobile}
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    select
                    label="Role"
                    name="role"
                    value={registerData.role}
                    onChange={handleChange}
                    margin="normal"
                    error={!!errors.role}
                    helperText={errors.role}
                    variant="outlined"
                >
                    <MenuItem key="admin" value="admin">Admin</MenuItem>
                    <MenuItem key="reader" value="reader">Reader</MenuItem>
                </TextField>
                <TextField
                    fullWidth
                    type='password'
                    label="Password"
                    name="password"
                    value={registerData.password}
                    onChange={handleChange}
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password}
                    variant="outlined"
                />
                {errors.register_status && <div className="error-message">{errors.register_status}</div>}
                <Grid container spacing={2}>
                    <Grid item xs={7}>
                        <Button
                            component={Link}
                            to="/react_task/"
                            variant="contained"
                            color="primary"
                            style={{ marginTop: 16, marginBottom: 16, float: 'right' }}
                        >
                            Login
                        </Button>
                        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 16, marginBottom: 16, float: 'right', marginRight: 16 }}>
                            Register
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}
