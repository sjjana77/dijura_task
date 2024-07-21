import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, IconButton, TextField, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { deleteExpense, deleteExpenseAsync } from '../slices/expenseslice';
import { setEditMode, setFormData } from '../slices/expense_edit_slice';
import { Link, useNavigate } from 'react-router-dom';
import { fetchExpenses } from '../slices/expenseslice';
import Pagination from '@mui/material/Pagination';

export default function Transactions() {
    const navigate = useNavigate();
    const expenses = useSelector((state) => state.expenses);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const delete_expense = (index, id) => {
        dispatch(deleteExpenseAsync(index, id));
        // dispatch(deleteExpense(index));
    };


    useEffect(() => {
        dispatch(setEditMode(false));
    }, []);

    const edit_expense = (index, id) => {
        const editFormData = { ...expenses.transactions[index], index: index, id: id };
        // console.log(editFormData);
        dispatch(setFormData(editFormData));
        dispatch(setEditMode(true));
        navigate('/react_task/form');
    };


    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    const handleFilter = () => {
        dispatch(fetchExpenses(currentPage, fromDate, toDate));
    };

    useEffect(() => {
        dispatch(fetchExpenses(currentPage));
    }, [dispatch, currentPage]);

    return (
        <div>
            <h3 style={{ margin: '20px' }}>Transactions
            </h3>
            <Paper style={{ marginBottom: '50px', padding: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <TextField
                        id="from-date"
                        label="From Date"
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="to-date"
                        label="To Date"
                        type="date"
                        value={toDate}
                        style={{ marginLeft: "20px" }}
                        onChange={(e) => setToDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button variant="contained" style={{ marginLeft: "20px", marginTop: "10px" }} onClick={handleFilter}>Filter</Button>
                </div>
                <Typography variant="body1" fontWeight="bold">Total Count: {expenses.totalDocuments ? expenses.totalDocuments : 0}</Typography>
                <Table>
                    <TableHead sx={{ background: "#0d6efd", color: "white" }} >
                        <TableRow>
                            <TableCell sx={{ color: "white", borderRight: '1px solid white' }}>S.No</TableCell>
                            <TableCell sx={{ color: "white", borderRight: '1px solid white' }}>User</TableCell>
                            <TableCell sx={{ color: "white", borderRight: '1px solid white' }}>Date</TableCell>
                            <TableCell sx={{ color: "white", borderRight: '1px solid white' }}>Transaction Message</TableCell>
                            <TableCell sx={{ color: "white", borderRight: '1px solid white' }}>Transaction Type</TableCell>
                            <TableCell sx={{ color: "white", borderRight: '1px solid white' }}>Amount</TableCell>
                            <TableCell sx={{ color: "white", borderRight: '1px solid white' }}>Mode of Payment</TableCell>
                            <TableCell sx={{ color: "white", borderRight: '1px solid white' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {expenses.transactions && expenses.transactions.map((items, index) =>
                            <TableRow key={index}>
                                <TableCell sx={{ borderRight: '1px solid white', background: "#3964a363" }}>{((currentPage - 1) * 10) + (index + 1)}</TableCell>
                                <TableCell sx={{ borderRight: '1px solid white', background: "#3964a363" }}>{items.username}</TableCell>
                                <TableCell sx={{ borderRight: '1px solid white', background: "#3964a363" }}>{items.date.slice(0, 10)}</TableCell>
                                <TableCell sx={{ borderRight: '1px solid white', background: "#3964a363" }}>{items.message}</TableCell>
                                <TableCell sx={{ borderRight: '1px solid white', background: "#3964a363" }}>{items.transaction_type}</TableCell>
                                <TableCell sx={{ borderRight: '1px solid white', background: "#3964a363" }}>{items.amount}</TableCell>
                                <TableCell sx={{ borderRight: '1px solid white', background: "#3964a363" }}>{items.mode}</TableCell>
                                <TableCell sx={{ borderRight: '1px solid white', background: "#3964a363" }}>
                                    <IconButton>
                                        <EditIcon onClick={() => edit_expense(index, items._id)} />
                                    </IconButton>
                                    <IconButton>
                                        <DeleteIcon onClick={() => delete_expense(index, items._id)} />

                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
            <Pagination
                count={expenses.totalPages}
                page={currentPage}
                onChange={handleChangePage}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                shape="rounded"
                style={{ justifyContent: 'center' }}
            />

        </div>
    )
}
