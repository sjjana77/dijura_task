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
      const data = await Apicall({ data: expensemode_filter, apiname: 'dashboard_data/expense_mode' });
      if (data) {
        setexpensemode(data);
      }
    };
    fetchData();
  }, [expensemode_filter]);



  return (
    <div>

      <div style={{ padding: '10px', background: "#0d6efd", color: "white", marginBottom: "10px" }}>Total Income by Payment Mode</div>
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
            <TableHead>
              <TableRow sx={{ background: "#0d6efd" }}>
                <TableCell sx={{ color: "white", borderRight: '1px solid white' }}>UPI</TableCell>
                <TableCell sx={{ color: "white", borderRight: '1px solid white' }}>Bank Transfer</TableCell>
                <TableCell sx={{ color: "white", borderRight: '1px solid white' }}>Cash</TableCell>
                <TableCell sx={{ color: "white", borderRight: '1px solid white' }}>Cheque</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ background: "#0d6efd6b" }}>
                <TableCell sx={{ borderRight: '1px solid white' }}>{expensemode.upi ? expensemode.upi : 0}</TableCell>
                <TableCell sx={{ borderRight: '1px solid white' }}>{expensemode.bank ? expensemode.bank : 0}</TableCell>
                <TableCell sx={{ borderRight: '1px solid white' }}>{expensemode.cash ? expensemode.cash : 0}</TableCell>
                <TableCell sx={{ borderRight: '1px solid white' }}>{expensemode.cheque ? expensemode.cheque : 0}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>

      </div>
    </div>
  )
}
