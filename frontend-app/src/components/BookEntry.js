import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import TransactionList from './TransactionList';
import TransactionEntryForm from './TransactionEntryForm';

const BookEntry = () => {
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookCount, setBookCount] = useState(0);
    const [book, setBook] = useState({ title: '', author: '' });
    const [availableBooks, setAvailableBooks] = useState(0);
    const [isAddDisabled, setIsAddDisabled] = useState(true);
    const { token } = useSelector((state) => state.auth);
    const { bookId } = useParams();

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
            const config = { headers: { Authorization: `Bearer ${token}` } };
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
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${process.env.REACT_APP_API_URL}users/get_users`, config);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAddTransaction = async (newTransaction) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post(`${process.env.REACT_APP_API_URL}transactions/create`, { ...newTransaction, bookId }, config);
            setTransactions([...transactions, { ...response.data.transaction, username: response.data.username }]);
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
            const config = { headers: { Authorization: `Bearer ${token}` } };
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
                <TransactionList
                    transactions={transactions}
                    onToggleTransactionType={handleToggleTransactionType}
                />
                <TransactionEntryForm
                    users={users}
                    onAddTransaction={handleAddTransaction}
                    isAddDisabled={isAddDisabled}
                />
                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                    Available Books: {availableBooks}
                </Typography>
            </Paper>
        </Container>
    );
};

export default BookEntry;
