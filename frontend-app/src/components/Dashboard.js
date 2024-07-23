import React, { useEffect, useState } from 'react';
import { Grid, Paper } from '@mui/material';
import Incomedash from './Incomedash';
import Expensedash from './Expensedash';
import IncomeCategorydash from './IncomeCategorydash';
import ExpenseCategorydash from './ExpenseCategorydash';
import Apicall from './Apicall';

export default function Dashboard() {
    const [month, setmonth] = useState([{
        month: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
        value: new Date().getFullYear() + "-" + new Date().getMonth()
    }]);
    const [incomecategory, setincomecategory] = useState([]);


    const [expensecategory, setexpensecategory] = useState([]);

    const [income_filter, setincome_filter] = useState({
        month: new Date().toISOString().slice(0, 10),
        source: 'All'
    });
    const [expense_filter, setexpense_filter] = useState({
        month: new Date().toISOString().slice(0, 10),
        source: 'All'
    });

    useEffect(() => {
        const fetchData = async () => {
            const data = await Apicall({ data: {}, apiname: 'dashboard_data/get_months' });
            if (data) {
                setmonth(data);
            }
        };
        fetchData();
    }, []);

    return (
        <div>

            <h3 style={{ margin: '20px' }}>Dashboard
            </h3>
            <Grid container spacing={2}>
                <Grid item xs={6} style={{ marginBottom: '20px' }}>
                    <Incomedash month={month} />
                </Grid>
                <Grid item xs={6} style={{ marginBottom: '20px' }}>
                    <Expensedash month={month} />
                </Grid>
                <Grid item xs={6}>
                    <ExpenseCategorydash month={month} />
                </Grid>
                <Grid item xs={6}>
                    <IncomeCategorydash month={month} />
                </Grid>
            </Grid>

        </div>
    )
}
