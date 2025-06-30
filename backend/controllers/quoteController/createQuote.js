const { encodeQuoteNumber, decodeQuoteNumber } = require("../../utils/quoteNum");
const db = require('../../models');
const { Quote, QuoteDetails, Customer } = db;
const router = require('express').Router();

router.post("/", async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { quoteDetails, customerId, customer, duplicate, ...quoteData } = req.body;

    const previousQuote = await Quote.findOne({
      where: { customer: customer },
      order: [["quote_no", "DESC"]],
      transaction: t
    });

    let major = 1n, minor = 0n, cusId = customerId;

    if (previousQuote) {
      const decoded = decodeQuoteNumber(previousQuote.quote_no);
      cusId = decoded.customerId;
      major = decoded.major;
      minor = duplicate ? decoded.minor + 1n : 0n;
      if (!duplicate) major += 1n;
    }
    console.log("asdfasdf",customerId);
    const quote_no = encodeQuoteNumber(BigInt(cusId), 0n, BigInt(major), BigInt(minor));
    const { id, ...safeQuoteData } = quoteData;

    const newQuote = await Quote.create(
      { ...safeQuoteData, quote_no, customer },
      { transaction: t }
    );

    const detailsWithQuoteId = quoteDetails.map(({id, ...detail}) => ({
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
