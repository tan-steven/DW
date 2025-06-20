const express = require('express');
const router = express.Router();

const { authenticateJWT } = require('../../Middleware/authProvider');
const { authorizeRoles } = require('../../Middleware/authorizeRoles');

const order = require('../../controllers/orderController/getOrder');
const getOrderDetails = require('../../controllers/orderController/getDetails');
const SubmitToInvoice = require('../../controllers/orderController/submitOrderAsInvoice');

router.use(authenticateJWT);
router.use(authorizeRoles('admin', 'order'));

router.use('/', order);
router.use('/', getOrderDetails);
router.use('/', SubmitToInvoice);

module.exports = router;