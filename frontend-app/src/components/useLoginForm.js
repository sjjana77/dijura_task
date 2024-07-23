import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../slices/authSlice';

const useLoginForm = () => {
    const [loginCredentials, setLoginCredentials] = useState({
        email_id: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email_id: '',
        password: '',
        server: ''
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
                // console.log(response);
                if(response.status === 201){
                    setErrors((prevErrors) => ({ ...prevErrors, server: response.data.error }));
                }
                else if(response.status === 200){

                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    dispatch(setAuthToken({ token, user }));
    
                    setErrors((prevErrors) => ({ ...prevErrors, server: '' }));
                    navigate('/react_task/books_catalog/');
                }

            } catch (error) {
                const errorMessage = error.response?.data?.error || 'An unexpected error occurred';
                setErrors((prevErrors) => ({ ...prevErrors, server: errorMessage }));
                console.error('Login error:', error);
            }
        }
    };

    return {
        loginCredentials,
        errors,
        handleChange,
        handleSubmit
    };
};

export default useLoginForm;
