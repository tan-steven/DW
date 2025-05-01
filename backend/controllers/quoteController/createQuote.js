const express = require("express");
const router = express.Router();
const db = require("../../models");
const { Quote, QuoteDetails } = db;

router.post("/", async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { quoteDetails, ...quoteData } = req.body;

    // Step 1: Create the quote
    const newQuote = await Quote.create(quoteData, { transaction: t });

    // Step 2: Attach quote_id to each quoteDetail
    const detailsWithQuoteId = quoteDetails.map(detail => ({
      ...detail,
      quote_id: newQuote.id, // assuming primary key is 'id'
    }));

    // Step 3: Bulk insert quote details
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
