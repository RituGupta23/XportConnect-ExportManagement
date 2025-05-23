const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const shippingRoutes = require('./routes/shippingRoutes.js');

dotenv.config();

const app = express();
app.use(express.json()); // For parsing JSON data

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('api/orders', orderRoutes);
app.use('/api/shipping', shippingRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});