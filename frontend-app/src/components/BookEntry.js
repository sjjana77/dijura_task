import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, IconButton, Switch, TextField, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

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
    const navigate = useNavigate();
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
        const newType = currentType === 'borrowed' ? 'returned' : 'borrowed';

        // Optimistically update the UI
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
            fetchTransactions(); // Re-fetch transactions to ensure sync with the server
        } catch (error) {
            console.error('Error toggling transaction type:', error);
            // Revert the UI update if the API call fails
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
                    Manage {book.title + " by " + book.author}Book Transactions
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Transaction Date</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Transaction Type</TableCell>
                            <TableCell>Return Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction, index) => (
                            <TableRow key={transaction._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{transaction.username}</TableCell>
                                <TableCell>{new Date(transaction.createdAt).toISOString().slice(0, 10)}</TableCell>
                                <TableCell>{new Date(transaction.dueDate).toISOString().slice(0, 10)}</TableCell>
                                <TableCell>
                                    {transaction.transactionType === 'borrowed' ? 'Borrowed' : 'Returned'}
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={transaction.transactionType === 'borrowed'}
                                        onChange={() => handleToggleTransactionType(transaction._id, transaction.transactionType)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell>Issue Entry</TableCell>
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
                                    value={getCurrentDate()}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
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
                                    <MenuItem value="borrowed">Borrow</MenuItem>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <IconButton edge="end" aria-label="add" onClick={handleAddTransaction} disabled={isAddDisabled}>
                                    <AddIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Typography variant="h6" gutterBottom>
                    Available Books: {availableBooks}
                </Typography>
            </Paper>
        </Container>
    );
};

export default BookEntry;
