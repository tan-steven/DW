const { encodeQuoteNumber } = require("../../utils/quoteNum");
const db = require('../../models');
const { Quote, QuoteDetails, Customer } = db; // import Customer model
const router = require('express').Router();

router.post("/", async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { quoteDetails, customer, status, ...quoteData } = req.body;

    // Step 1: Get the customer's latest major and minor numbers
    const previousQuote = await Quote.findOne({
      where: { customer: customer },
      order: [["quote_no", "DESC"]],
      transaction: t
    });

    let major = 1, minor = 0;

    if (previousQuote) {
      const prevQuoteNo = parseInt(previousQuote.quote_no);
      const prevStatus = (prevQuoteNo >> 23) & 0b11;
      const prevMajor = (prevQuoteNo >> 8) & 0x7FFF;
      const prevMinor = prevQuoteNo & 0xFF;

      if (prevStatus === status && prevMajor === major) {
        minor = prevMinor + 1;
      } else {
        major = prevMajor + 1;
      }
    }

    const quote_no = encodeQuoteNumber(BigInt(customer), status, major, minor);

    const { id, ...safeQuoteData } = quoteData;

    const newQuote = await Quote.create(
      { ...safeQuoteData, quote_no, customer, status },
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