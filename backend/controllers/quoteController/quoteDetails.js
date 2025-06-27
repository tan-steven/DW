const quote_detail = require('express').Router();
const db = require('../../models');
const { QuoteDetails, Quote } = db;


quote_detail.post('/', async (req, res) => {
  try {
    const newDetail = await QuoteDetails.create(req.body);
    res.status(201).json(newDetail);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create quote detail");
  }
});

quote_detail.get('/:quote_id', async (req, res) => {
  try {
    const { quote_id } = req.params;
    const details = await QuoteDetails.findAll({
      where: { quote_id },
      order: [['id', 'ASC']]
    });
    res.json(details);
  } catch (err) {
    console.error("Error fetching quote details:", err);
    res.status(500).send("Failed to fetch quote details");
  }
});

module.exports = quote_detail;