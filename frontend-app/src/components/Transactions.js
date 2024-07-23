import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Paper, Grid } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const { token, user } = useSelector((state) => state.auth);
    const { userId: paramUserId } = useParams(); // Get userId from URL parameters
    const userId = paramUserId || user.id; // Use paramUserId if available, otherwise use user.id from Redux store

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
                <List>
                    {transactions.map((transaction) => (
                        <ListItem key={transaction._id}>
                            <Grid container alignItems="center">
                                <Grid item xs={8}>
                                    <ListItemText
                                        primary={`Book: ${transaction.bookId.title} by ${transaction.bookId.author}`}
                                        secondary={`Borrowed: ${new Date(transaction.createdAt).toLocaleString()}`}
                                    />
                                </Grid>
                                <Grid item xs={4} container direction="column" alignItems="flex-end">
                                    <Typography variant="body2" color="textSecondary">
                                        Due Date: {new Date(transaction.dueDate).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color={transaction.returnedDate ? "textSecondary" : "error"}>
                                        {transaction.returnedDate ? `Returned: ${new Date(transaction.returnedDate).toLocaleString()}` : 'Return: Pending'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default Transactions;
