require('dotenv').config();
const express = require("express");
const app = express();
const { Sequelize } = require('sequelize');
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// controllers
const customerRoute = require('./controllers/customerController/customers');
const { login } = require('./controllers/authController/authController');
const { createUser, updateUserRoles } = require('./controllers/authController/userController');
const quoteRoutes = require('./routes/quotes/quoteRoutes');
const orderRoutes = require('./routes/order/orderRoutes');
const invoiceRoutes = require('./routes/invoice/invoiceRoutes');
const deliveries = require('./controllers/deliveryController/deliveries');
const formulas = require('./controllers/formulaController/formulas');

app.post('/api/users', createUser);
app.put('/api/users/:id', updateUserRoles);
app.post('/api/login', login);
app.use('/api/customers', customerRoute);
app.use('/api/quotes', quoteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/deliveries', deliveries);
app.use('/api/formulas', formulas);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
