import React, { useState } from 'react';
import { Container, Typography, Button, Grid } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import FormField from './FormField';
import ErrorMessage from './ErrorMessage';

const RegisterForm = () => {
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

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhoneNumber = (phone) => /^\d{10}$/.test(phone);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formValid = true;

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
                    setRegisterData({
                        name: '',
                        email_id: '',
                        mobile: '',
                        role: '',
                        password: ''
                    });
                    navigate(-1);
                } else {
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
                <FormField
                    type='text'
                    label="Name"
                    name="name"
                    value={registerData.name}
                    onChange={handleChange}
                    error={errors.name}
                    helperText={errors.name}
                />
                <FormField
                    type='email'
                    label="Email"
                    name="email_id"
                    value={registerData.email_id}
                    onChange={handleChange}
                    error={errors.email_id}
                    helperText={errors.email_id}
                />
                <FormField
                    type='number'
                    label="Mobile"
                    name="mobile"
                    value={registerData.mobile}
                    onChange={handleChange}
                    error={errors.mobile}
                    helperText={errors.mobile}
                />
                <FormField
                    type='select'
                    label="Role"
                    name="role"
                    value={registerData.role}
                    onChange={handleChange}
                    error={errors.role}
                    helperText={errors.role}
                    options={[
                        { label: 'Admin', value: 'admin' },
                        { label: 'Reader', value: 'reader' }
                    ]}
                />
                <FormField
                    type='password'
                    label="Password"
                    name="password"
                    value={registerData.password}
                    onChange={handleChange}
                    error={errors.password}
                    helperText={errors.password}
                />
                <ErrorMessage message={errors.register_status} />
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

export default RegisterForm;
