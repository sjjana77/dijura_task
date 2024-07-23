import React from 'react';
import { ListItem, ListItemText, Grid, Typography } from '@mui/material';

const TransactionItem = ({ transaction }) => {
    return (
        <ListItem>
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
    );
};

export default TransactionItem;
