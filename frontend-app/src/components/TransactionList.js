import React from 'react';
import { Grid, Switch } from '@mui/material';

const TransactionList = ({ transactions, onToggleTransactionType }) => {
    return (
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
                                onChange={() => onToggleTransactionType(transaction._id, transaction.transactionType)}
                            />
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};

export default TransactionList;
