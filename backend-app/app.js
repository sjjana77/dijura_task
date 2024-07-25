const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const app = express();
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://sjjana77.github.io'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/library_managemeny_system/users', userRoutes);
app.use('/library_managemeny_system/books', bookRoutes);
app.use('/library_managemeny_system/transactions', transactionRoutes);
app.use('/library_managemeny_system/books', bookRoutes);
app.use('/library_managemeny_system/transactions', transactionRoutes);


connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
