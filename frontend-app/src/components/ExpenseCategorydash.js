import React, { useState, useEffect } from 'react'
import { Grid, Paper } from '@mui/material';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Apicall from './Apicall';

export default function Expensedash({ month }) {

    const [expensemode, setexpensemode] = useState([]);
    const [expensemode_filter, setexpensemode_filter] = useState({
        month: new Date().getFullYear() + "-" + new Date().getMonth(),
        source: 'All'
    });


    // console.log(month);
    useEffect(() => {
        const fetchData = async () => {
            const data = await Apicall({ data: expensemode_filter, apiname: 'dashboard_data/expense_category' });
            if (data) {
                setexpensemode([...data]);
                console.log(data);
            }
        };
        fetchData();
    }, [expensemode_filter]);

    useEffect(() => {

    }, [expensemode])

    return (
        <div>

            <div style={{ padding: '10px', background: "#0d6efd", color: "white", marginBottom: "10px" }}>Expense by Category</div>
            <div style={{ border: '2px solid #0d6efd', padding: "30px", borderRadius: "25px" }}>
                <Grid container spacing={3} sx={{ marginBottom: "10px" }}>
                    <Grid item xs={4}>
                        Select Month
                    </Grid>
                    <Grid item xs={4}>
                        <select className='form-control' name="month" onChange={(e) => setexpensemode_filter({ ...expensemode_filter, month: e.currentTarget.value })}>
                            {month.map((item) => (
                                <option key={item.value} value={item.value} selected={item.month === expensemode_filter.month}>
                                    {item.month}
                                </option>
                            ))}
                        </select>

                    </Grid>
                    <Grid item xs={4}>
                        <select className='form-control' name="source" onChange={(e) => setexpensemode_filter({ ...expensemode_filter, source: e.currentTarget.value })}>
                            <option value='All'>All</option>
                            <option value='home'>Home</option>
                            <option value='office'>Office</option>
                        </select>
                    </Grid>
                </Grid>

                <Paper>
                    <Table>
                        <TableBody>
                            {expensemode.map((item, index) => (
                                <TableRow key={index} sx={{ background: "#0d6efd6b" }}>
                                    <TableCell sx={{ borderRight: '1px solid white' }}>{item.message}</TableCell>
                                    <TableCell sx={{ borderRight: '1px solid white' }}>{item.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                        {/* <TableBody>
              <TableRow sx={{ background: "#0d6efd6b" }}>
                <TableCell sx={{ borderRight: '1px solid white' }}>{expensemode.upi}</TableCell>
                <TableCell sx={{ borderRight: '1px solid white' }}>{expensemode.bank}</TableCell>
                <TableCell sx={{ borderRight: '1px solid white' }}>{expensemode.cash}</TableCell>
                <TableCell sx={{ borderRight: '1px solid white' }}>{expensemode.cheque}</TableCell>
              </TableRow>
            </TableBody> */}
                    </Table>
                </Paper>

            </div>
        </div>
    )
}
