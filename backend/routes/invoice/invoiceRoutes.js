const express = require('express');
const router = express.Router();

const { authenticateJWT } = require('../../Middleware/authProvider');
const { authorizeRoles } = require('../../Middleware/authorizeRoles');

const invoice = require('../../controllers/invoiceController/getInvoice');
const invoiceDetails =require('../../controllers/invoiceController/getInvoiceDetails');

router.use(authenticateJWT);
router.use(authorizeRoles('admin', 'invoice'));

router.use('/', invoice);
router.use('/', invoiceDetails);

module.exports = router;