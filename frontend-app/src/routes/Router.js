// src/routes/Router.js
import React from "react";
import { BrowserRouter as Routerr, Route, Routes } from "react-router-dom";
import Header from '../components/Header';
import Login from '../components/Login';
import Register from '../components/Register';
import BookCatalog from '../components/BookCatalog';
import AddOrEditBook from '../components/AddOrEditBook';
import BookEntry from '../components/BookEntry';
import Transactions from '../components/Transactions'; // Import the Transactions component
import ProtectedRoute from '../routes/ProtectedRoute'; // Import the ProtectedRoute component

const Router = () => {
  return (
    <Routerr>
      <div style={{ margin: '0 20px' }}>
        <Routes>
          <Route exact path="/react_task" element={<Login />} />
          <Route exact path="/react_task/register" element={<Register />} />
          <Route
            path="/react_task/books_catalog"
            element={
              <ProtectedRoute>
                <Header />
                <BookCatalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/react_task/register_user"
            element={
              <ProtectedRoute>
                <Header />
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/react_task/books/add"
            element={
              <ProtectedRoute adminOnly={true}>
                <Header />
                <AddOrEditBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/react_task/books/edit/:id"
            element={
              <ProtectedRoute adminOnly={true}>
                <Header />
                <AddOrEditBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/react_task/books/borrow-return/:bookId"
            element={
              <ProtectedRoute adminOnly={true}>
                <Header />
                <BookEntry />
              </ProtectedRoute>
            }
          />
          <Route
            path="/react_task/transactions"
            element={
              <ProtectedRoute>
                <Header />
                <Transactions />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Routerr>
  );
}

export default Router;
