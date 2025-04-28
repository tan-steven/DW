const createQuote = require('express').Router();
const db = require('../../models');
const { Quote } = db;

createQuote.post('/', async (req, res) => {
  try {
    const newQuote = await Quote.create(req.body);
    res.status(201).json(newQuote);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create quote");
  }
});

module.exports = createQuote;
