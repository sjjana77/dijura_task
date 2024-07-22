import React from "react";
import { BrowserRouter as Routerr, Route, Routes } from "react-router-dom";
import TransactionForm from '../components/Add_transaction_form';
import Transactions from '../components/Transactions';
// import Dashboard from '../components/Dashboard';
import Header from '../components/Header';
import Login from '../components/Login';
import Register from '../components/Register';
import Book from '../components/Book';
import AddOrEditBook from '../components/AddOrEditBook';
import BookEntry from '../components/BookEntry';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component

const Router = () => {
    return (
        <Routerr>
            <Header />
            <div style={{ margin: '0 20px' }}>
                <Routes>
                    <Route exact path="/react_task" element={<Login />} />
                    <Route exact path="/react_task/register" element={<Register />} />
                    <Route
                        path="/react_task/books"
                        element={
                            <ProtectedRoute>
                                <Book />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/react_task/books/add"
                        element={
                            <ProtectedRoute>
                                <AddOrEditBook />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/react_task/books/edit/:id"
                        element={
                            <ProtectedRoute>
                                <AddOrEditBook />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/react_task/books/borrow-return/:bookId"
                        element={
                            <ProtectedRoute>
                                <BookEntry />
                            </ProtectedRoute>
                        }
                    />
                    {/* <Route exact path="/react_task" element={<Dashboard />} /> */}
                    <Route exact path="/react_task/transactions" element={<Transactions />} />
                    <Route path="/react_task/form" element={<TransactionForm />} />
                </Routes>
            </div>
        </Routerr>
    )
}


export default Router;