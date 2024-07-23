import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, TextField, Select, MenuItem, Switch, Grid } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const BookEntry = () => {
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookCount, setBookCount] = useState(0);
    const [book, setBook] = useState('');
    const [newTransaction, setNewTransaction] = useState({
        userId: '',
        dueDate: '',
        transactionType: 'borrowed'
    });
    const [availableBooks, setAvailableBooks] = useState(0);
    const [isAddDisabled, setIsAddDisabled] = useState(true);
    const { token } = useSelector((state) => state.auth);
    const { bookId } = useParams();

    const getCurrentDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    useEffect(() => {
        fetchTransactions();
        fetchUsers();
    }, []);

    useEffect(() => {
        const available = bookCount - transactions.length;
        setAvailableBooks(available);
        setIsAddDisabled(available <= 0);
    }, [transactions, bookCount]);

    const fetchTransactions = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${process.env.REACT_APP_API_URL}transactions/bookId/${bookId}/transactionType/borrowed`, config);
            setTransactions(response.data.transactions);
            setBookCount(response.data.book.count);
            setBook({ title: response.data.book.title, author: response.data.book.author });
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${process.env.REACT_APP_API_URL}users/get_users`, config);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAddTransaction = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(`${process.env.REACT_APP_API_URL}transactions/create`, { ...newTransaction, bookId }, config);
            setTransactions([...transactions, { ...response.data.transaction, username: response.data.username }]);
            setNewTransaction({ userId: '', dueDate: '', transactionType: 'borrowed' });
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const handleToggleTransactionType = async (transactionId, currentType) => {
        const newType = currentType === 'borrowed' ? 'returned' : 'borrowed';

        setTransactions(transactions.map(transaction =>
            transaction._id === transactionId
                ? { ...transaction, transactionType: newType }
                : transaction
        ));

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.put(`${process.env.REACT_APP_API_URL}transactions/toggle/${transactionId}`, { transactionType: newType }, config);
            fetchTransactions();
        } catch (error) {
            console.error('Error toggling transaction type:', error);
            setTransactions(transactions.map(transaction =>
                transaction._id === transactionId
                    ? { ...transaction, transactionType: currentType }
                    : transaction
            ));
        }
    };

    return (
        <Container maxWidth="md" style={{ padding: '20px' }}>
            <Paper style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Manage {book.title + " by " + book.author} Book Transactions
                </Typography>
                <Grid container spacing={2} style={{ marginTop: '4px' }}>
                    <Grid item xs={12}>
                        <Grid container spacing={2} alignItems="center" style={{ fontWeight: 'bold' }}>
                            <Grid item xs={1}>#</Grid>
                            <Grid item xs={3}>User</Grid>
                            <Grid item xs={2}>Borrow Date</Grid>
                            <Grid item xs={2}>Due Date</Grid>
                            <Grid item xs={2}>Transaction Type</Grid>
                            <Grid item xs={2}>Action</Grid>
                        </Grid>
                        {transactions.map((transaction, index) => (
                            <Grid container spacing={2} key={transaction._id} alignItems="center">
                                <Grid item xs={1}>{index + 1}</Grid>
                                <Grid item xs={3}>{transaction.username}</Grid>
                                <Grid item xs={2}>{new Date(transaction.createdAt).toISOString().slice(0, 10)}</Grid>
                                <Grid item xs={2}>{new Date(transaction.dueDate).toISOString().slice(0, 10)}</Grid>
                                <Grid item xs={2}>
                                    {transaction.transactionType === 'borrowed' ? 'Borrowed' : 'Returned'}
                                </Grid>
                                <Grid item xs={2}>
                                    <Switch
                                        checked={transaction.transactionType === 'borrowed'}
                                        onChange={() => handleToggleTransactionType(transaction._id, transaction.transactionType)}
                                    />
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
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
                            onClick={handleAddTransaction}
                            disabled={isAddDisabled}
                            fullWidth
                        >
                            Add Entry
                        </Button>
                    </Grid>
                </Grid>
                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                    Available Books: {availableBooks}
                </Typography>
            </Paper>
        </Container>
    );
};

export default BookEntry;
