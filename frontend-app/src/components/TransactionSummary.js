import React from 'react';
import { List } from '@mui/material';
import TransactionItem from './TransactionItem';

const TransactionSummary = ({ transactions }) => {
    return (
        <List>
            {transactions.map((transaction) => (
                <TransactionItem key={transaction._id} transaction={transaction} />
            ))}
        </List>
    );
};

export default TransactionSummary;
