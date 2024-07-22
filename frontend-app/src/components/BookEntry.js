import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, IconButton, Switch, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const BookEntry = () => {
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [newTransaction, setNewTransaction] = useState({
        userId: '',
        dueDate: '',
        transactionType: 'borrowed' // Use transactionType instead of borrowed
    });
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const { bookId } = useParams();

    useEffect(() => {
        fetchTransactions();
        fetchUsers();
    }, []);

    const fetchTransactions = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${process.env.REACT_APP_API_URL}transactions/bookId/${bookId}/transactionType/borrowed`, config);
            setTransactions(response.data);
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
            setTransactions([...transactions, response.data]);
            setNewTransaction({ userId: '', dueDate: '', transactionType: 'borrowed' });
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const handleRemoveTransaction = async (transactionId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.delete(`${process.env.REACT_APP_API_URL}transactions/${transactionId}`, config);
            setTransactions(transactions.filter(transaction => transaction._id !== transactionId));
        } catch (error) {
            console.error('Error removing transaction:', error);
        }
    };

    const handleToggleTransactionType = async (transactionId, currentType) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const newType = currentType === 'borrowed' ? 'returned' : 'borrowed';
            await axios.put(`${process.env.REACT_APP_API_URL}transactions/${transactionId}`, { transactionType: newType }, config);
            fetchTransactions();
        } catch (error) {
            console.error('Error toggling transaction type:', error);
        }
    };

    return (
        <Container maxWidth="md" style={{ padding: '20px' }}>
            <Paper style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Manage Book Transactions
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Transaction Date</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Transaction Type</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction, index) => (
                            <TableRow key={transaction.transaction._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{transaction.username}</TableCell>
                                <TableCell>{new Date(transaction.transaction.createdAt).toISOString().slice(0, 10)}</TableCell>
                                <TableCell>{new Date(transaction.transaction.dueDate).toISOString().slice(0, 10)}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={transaction.transactionType === 'borrowed'}
                                        onChange={() => handleToggleTransactionType(transaction._id, transaction.transactionType)}
                                    />
                                    {transaction.transactionType === 'borrowed' ? 'Borrowed' : 'Returned'}
                                </TableCell>
                                <TableCell>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTransaction(transaction._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell>Add New</TableCell>
                            <TableCell>
                                <Select
                                    value={newTransaction.userId}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, userId: e.target.value })}
                                    fullWidth
                                >
                                    {users.map(user => (
                                        <MenuItem key={user._id} value={user._id}>{user.username}</MenuItem>
                                    ))}
                                </Select>
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type="date"
                                    value={newTransaction.dueDate}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, dueDate: e.target.value })}
                                    fullWidth
                                />
                            </TableCell>
                            <TableCell>
                                <Select
                                    value={newTransaction.transactionType}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, transactionType: e.target.value })}
                                    fullWidth
                                >
                                    <MenuItem value="borrowed">Borrowed</MenuItem>
                                    <MenuItem value="returned">Returned</MenuItem>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <IconButton edge="end" aria-label="add" onClick={handleAddTransaction}>
                                    <AddIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default BookEntry;
