import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
const expenseslice = createSlice({
    name: "expense",
    initialState,
    reducers: {
        addExpense(state, action) {
            state.transactions.push(action.payload);
        },
        updateExpense(state, action) {
            const { index } = action.payload;
            state[index] = { index, ...action.payload };
        },
        deleteExpense(state, action) {
            return {
                ...state,
                transactions: state.transactions.filter((_, index) => index !== action.payload)
            };
        },

        setExpenses(state, action) {
            return action.payload;
        },
    }
});

export const { addExpense, deleteExpense, updateExpense, setExpenses } = expenseslice.actions;

export const fetchExpenses = (page, f_date, t_date) => async (dispatch) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}transactions?page=${page}&fdate=${f_date}&tdate=${t_date}`);
        if (!response.ok) {
            throw new Error("Failed to fetch expenses");
        }
        const expenses = await response.json();
        dispatch(setExpenses(expenses));
    } catch (error) {
        console.error("Error fetching expenses:", error);
    }
};

export const deleteExpenseAsync = (index, id) => async (dispatch, getState) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}transactions/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error("Failed to delete expense");
        }
        const page = getState().expenses.currentPage;
        const fromDate = getState().expenses.fromDate;
        const toDate = getState().expenses.toDate;
        dispatch(fetchExpenses(page, fromDate, toDate));
        // dispatch(deleteExpense(index));
    } catch (error) {
        console.error("Error deleting expense:", error);
    }
};

// const removeExpense = (index) => ({ type: "expense/deleteExpense", payload: index });

export default expenseslice.reducer;
