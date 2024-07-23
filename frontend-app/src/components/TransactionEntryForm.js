import React, { useState } from 'react';
import { Grid, Typography, TextField, Select, MenuItem, Button } from '@mui/material';

const TransactionEntryForm = ({ users, onAddTransaction, isAddDisabled }) => {
    const [newTransaction, setNewTransaction] = useState({
        userId: '',
        dueDate: '',
        transactionType: 'borrowed'
    });

    const getCurrentDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const handleSubmit = () => {
        onAddTransaction(newTransaction);
        setNewTransaction({ userId: '', dueDate: '', transactionType: 'borrowed' });
    };

    return (
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={12}>
                <Typography variant="h5" fontWeight="500">Issue Entry</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography fontWeight="400">Select User</Typography>
                <Select
                    value={newTransaction.userId}
                    onChange={(e) => setNewTransaction({ ...newTransaction, userId: e.target.value })}
                    fullWidth
                >
                    {users.map(user => (
                        <MenuItem key={user._id} value={user._id}>{user.username}</MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid item xs={3}>
                <Typography fontWeight="400">Borrow Date</Typography>
                <TextField
                    type="date"
                    value={getCurrentDate()}
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Grid>
            <Grid item xs={3}>
                <Typography fontWeight="400">Due Date</Typography>
                <TextField
                    type="date"
                    value={newTransaction.dueDate}
                    onChange={(e) => setNewTransaction({ ...newTransaction, dueDate: e.target.value })}
                    fullWidth
                />
            </Grid>
            <Grid item xs={3}>
                <Typography fontWeight="400">Transaction Type</Typography>
                <Select
                    value={newTransaction.transactionType}
                    onChange={(e) => setNewTransaction({ ...newTransaction, transactionType: e.target.value })}
                    fullWidth
                >
                    <MenuItem value="borrowed">Borrow</MenuItem>
                </Select>
            </Grid>
            <Grid item xs={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isAddDisabled}
                    fullWidth
                >
                    Add Entry
                </Button>
            </Grid>
        </Grid>
    );
};

export default TransactionEntryForm;
