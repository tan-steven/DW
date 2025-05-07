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
const submitInvoice = require("./controllers/invoiceController/submitInvoice");
const invoiceDetails = require("./controllers/invoiceController/getInvoiceDetails");

app.use('/api/quotes', getQuote);
app.use('/api/quotes', createQuote);
app.use('/api/quoteDetails', quote_detail);
app.use('/api/quoteDetails', get_quote_details);
app.use('/api/invoices', getInvoice);
app.use("/api/quotes", submitInvoice);
app.use("/api/invoiceDetails", invoiceDetails);

const port = process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});