import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import TransactionSummary from './TransactionSummary';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const { token, user } = useSelector((state) => state.auth);
    const { userId: paramUserId } = useParams();
    const userId = paramUserId || user.id;

    useEffect(() => {
        fetchTransactions();
    }, [userId]);

    const fetchTransactions = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${process.env.REACT_APP_API_URL}transactions/user/${userId}`, config);
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    return (
        <Container maxWidth="md" style={{ padding: '20px' }}>
            <Paper style={{ padding: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Transactions {transactions && transactions.length > 0 ? ' - ' + transactions[0].userId.username : ''}
                </Typography>
                <TransactionSummary transactions={transactions} /> 
            </Paper>
        </Container>
    );
};

export default Transactions;
