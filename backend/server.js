require('dotenv').config();
const express = require("express");
const app = express();
const {Sequelize} = require('sequelize');
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//controllers
const getQuote = require('./controllers/quoteController/getQuote');
const createQuote = require('./controllers/quoteController/createQuote');
const quote_detail = require('./controllers/quoteController/quoteDetails');
const get_quote_details = require('./controllers/quoteController/getDetails');
const getInvoice = require('./controllers/invoiceController/getInvoice');
const invoiceDetails = require("./controllers/invoiceController/getInvoiceDetails");
const getOrders = require("./controllers/orderController/getOrder");
const getDetails = require("./controllers/orderController/getDetails");
const submitOrder = require('./controllers/quoteController/submitOrder');
const submitOrderAsInvoice = require('./controllers/orderController/submitOrderAsInvoice');

app.use('/api/orders', submitOrderAsInvoice);
app.use('/api/quotes', getQuote);
app.use('/api/quotes', createQuote);
app.use('/api/quoteDetails', quote_detail);
app.use('/api/quoteDetails', get_quote_details);
app.use('/api/invoices', getInvoice);
app.use("/api/invoiceDetails", invoiceDetails);
app.use('/api/getOrders', getOrders);
app.use('/api/orderDetails', getDetails);
app.use('/api/quotes', submitOrder);

const port = process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});