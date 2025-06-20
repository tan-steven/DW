const express = require('express');
const router = express.Router();

const { authenticateJWT } = require('../../Middleware/authProvider');
const { authorizeRoles } = require('../../Middleware/authorizeRoles');

const getQuote = require('../../controllers/quoteController/getQuote');
const createQuote = require('../../controllers/quoteController/createQuote');
const submitOrder = require('../../controllers/quoteController/submitOrder');

router.use(authenticateJWT);
router.use(authorizeRoles('admin', 'quote'));

router.use('/', getQuote);
router.use('/', createQuote);
router.use('/', submitOrder);


const quote_detail = require('../../controllers/quoteController/quoteDetails');
const get_quote_details = require('../../controllers/quoteController/getDetails');

router.use('/', quote_detail);
router.use('/', get_quote_details);


module.exports = router;
