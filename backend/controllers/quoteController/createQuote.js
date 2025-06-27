const { encodeQuoteNumber, decodeQuoteNumber } = require("../../utils/quoteNum");
const db = require('../../models');
const { Quote, QuoteDetails, Customer } = db;
const router = require('express').Router();

router.post("/", async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { quoteDetails, customerId, customer, ...quoteData } = req.body;

    // Step 1: Get the customer's latest major and minor numbers
    const previousQuote = await Quote.findOne({
      where: { customer: customer },
      order: [["quote_no", "DESC"]],
      transaction: t
    });

    let major = 1, minor = 0;

    if (previousQuote) {
      const decoded = decodeQuoteNumber(previousQuote.quote_no);
      major = decoded.major + 1n;
      minor = 0;
    }

    const quote_no = encodeQuoteNumber(BigInt(customerId), 0, major, minor);
    const { id, ...safeQuoteData } = quoteData;

    // Step 2: Create the main quote
    const newQuote = await Quote.create(
      { ...safeQuoteData, quote_no, customer },
      { transaction: t }
    );

    // Step 3: Add quoteDetails
    const detailsWithQuoteId = quoteDetails.map(detail => ({
      ...detail,
      quote_id: newQuote.quote_no,
    }));

    await QuoteDetails.bulkCreate(detailsWithQuoteId, { transaction: t });

    await t.commit();
    res.status(201).json({ message: "Quote and details created" });
  } catch (err) {
    await t.rollback();
    console.error("Error creating quote with details:", err);
    res.status(500).send("Failed to create quote and details");
  }
});

module.exports = router;
