import { createSlice } from '@reduxjs/toolkit';

export const editModeSlice = createSlice({
    name: 'editMode',
    initialState: {
        editMode: false,
        formData: {
            date: '',
            amount: '',
            message: '',
            transaction_type: '',
            mode: '',
            source: '',
            user: ''
        }
    },
    reducers: {
        setEditMode: (state, action) => {
            state.editMode = action.payload;
        },
        setFormData: (state, action) => {
            state.formData = action.payload;
        },
        editExpense: (state, action) => {
            const { index, updatedExpense } = action.payload;
            state[index] = updatedExpense;
        },
    }
});

export const { setEditMode, setFormData, editExpense } = editModeSlice.actions;

export default editModeSlice.reducer;
