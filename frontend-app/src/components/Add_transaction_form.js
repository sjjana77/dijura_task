import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, MenuItem, Grid } from '@mui/material';
import { addExpense, updateExpense } from '../slices/expenseslice';
import { setEditMode, editExpense } from '../slices/expense_edit_slice';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Add_transaction_form = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    message: '',
    transaction_type: '',
    mode: '',
    source: '',
    user: ''
  });

  const [errors, setErrors] = useState({
    amount: '',
    user: '',
    date: '',
    message: ''
  });
  const dispatch = useDispatch();
  const editMode = useSelector((state) => state.editMode.editMode);
  const editFormData = useSelector((state) => state.editMode.formData);
  const index = useSelector((state) => state.editMode.formData.index);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // useEffect(() => {
  //   console.log(formData);
  // }, [formData])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}users`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  useEffect(() => {
    if (editMode) {
      // console.log(editFormData);
      setFormData(editFormData);
    }
  }, [editMode, editFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formValid = true;
    if (!formData.amount) {
      setErrors({ ...errors, amount: 'Amount is required' });
      formValid = false;
    } else {
      setErrors({ ...errors, amount: '' });
    }

    if (!formData.user) {
      setErrors({ ...errors, user: 'User is required' });
      formValid = false;
    } else {
      setErrors({ ...errors, user: '' });
    }

    if (!formData.date) {
      setErrors({ ...errors, date: 'Date is required' });
      formValid = false;
    } else {
      setErrors({ ...errors, date: '' });
    }

    if (!formData.message) {
      setErrors({ ...errors, message: 'Message is required' });
      formValid = false;
    } else {
      setErrors({ ...errors, message: '' });
    }

    if (formValid) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}transactions/`, formData);
      } catch (error) {
        console.error('Failed to update expense:', error);
      }
      if (editMode) {
        // dispatch(editExpense(index, formData));
        dispatch(updateExpense(formData));
        dispatch(setEditMode(false));
        setFormData({
          date: '',
          amount: '',
          message: '',
          transaction_type: '',
          mode: '',
          source: '',
          user: ''
        });

        navigate('/react_task/transactions');
      } else {
        dispatch(addExpense(formData));
        setFormData({
          date: '',
          amount: '',
          message: '',
          transaction_type: '',
          mode: '',
          source: '',
          user: ''
        });
        navigate('/react_task');
      }

    }


  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        {editMode ? `Update Transaction` : `Add Transaction`}
      </Typography>
      <form onSubmit={handleSubmit}>

        <TextField
          fullWidth
          select
          label="User"
          name="user"
          value={formData.user}
          onChange={handleChange}
          margin="normal"
          error={!!errors.user}
          helperText={errors.user}
          variant="outlined"
        >
          {users.map((user) => (
            <MenuItem key={user._id} value={user._id}>{user.username}</MenuItem>
          ))}
          {/* <MenuItem value="User_2">User_2</MenuItem>
          <MenuItem value="User_3">User_3</MenuItem>
          <MenuItem value="User_4">User_4</MenuItem>
          <MenuItem value="User_5">User_5</MenuItem> */}
        </TextField>
        <TextField
          fullWidth
          type="date"
          label="Date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          variant="outlined"
          error={!!errors.date}
          helperText={errors.date}
        />

        <TextField
          fullWidth
          label="Amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          error={!!errors.amount}
          helperText={errors.amount}
          inputProps={{
            type: 'number',
            pattern: '[0-9]*',
          }}
        />

        <TextField
          multiline
          label="Message"
          name='message'
          rows={4}
          style={{ width: '100%' }}
          maxRows={4}
          value={formData.message}
          onChange={handleChange}
          error={!!errors.message}
          helperText={errors.message}
          margin="normal"
          variant="outlined"
        />


        <TextField
          fullWidth
          select
          label="Transaction Type"
          name="transaction_type"
          value={formData.transaction_type}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        >
          <MenuItem value="expense">Expense</MenuItem>
          <MenuItem value="income">Income</MenuItem>
        </TextField>
        <TextField
          fullWidth
          select
          label="Mode of Payment"
          name="mode"
          value={formData.mode}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        >
          <MenuItem value="upi">UPI</MenuItem>
          <MenuItem value="cash">Cash</MenuItem>
          <MenuItem value="bank">Bank Transfer</MenuItem>
          <MenuItem value="cheque">Cheque</MenuItem>
        </TextField>
        <TextField
          fullWidth
          select
          label="Source"
          name="source"
          value={formData.source}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        >
          <MenuItem value="home">Home</MenuItem>
          <MenuItem value="office">Office</MenuItem>
        </TextField>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button type="submit" variant="contained" color="success" style={{ marginTop: 16, marginBottom: 16, float: 'right' }}>
              {editMode ? `Update` : `Save`}
            </Button>

          </Grid>
          <Grid item xs={6}>
            <Link to="/react_task/transactions">
              <Button type="button" variant="contained" color="primary" style={{ marginTop: 16, marginBottom: 16 }}>
                Cancel
              </Button>
            </Link>

          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Add_transaction_form;
