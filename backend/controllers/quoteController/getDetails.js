const get_quote_details = require('express').Router();
const db = require('../../models');
const { QuoteDetails } = db;

get_quote_details.get('/:quote_id', async (req, res) => {
  try {
    const { quote_id } = req.params;
    const details = await db.QuoteDetails.findAll({ where: { quote_id } });
    res.json(details);
  } catch (err) {
    console.error("Error fetching quote details:", err);
    res.status(500).send("Failed to fetch quote details");
  }
});


module.exports = get_quote_details;