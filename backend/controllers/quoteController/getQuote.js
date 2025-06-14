const getQuote = require('express').Router()
const db = require('../../models')
const { Quote } = db

getQuote.get('/', async (req, res)=>{
    try{
        const foundQuotes = await Quote.findAll({
          attributes: ['id', 'quote_no', 'date', 'customer', 'total', 'sub_total'] // Explicitly include quote_no
        });
        res.status(200).json(foundQuotes);
    }catch(err){
        res.status(500).send("failed to get data");
        console.log(err);
    }
})

getQuote.get('/quote-no/:quote_no', async (req, res) => {
  try {
    const quote = await Quote.findOne({
      where: { quote_no: req.params.quote_no },
    });
    if (!quote) {
      return res.status(404).send("Quote not found");
    }
    res.json(quote);
  } catch (err) {
    res.status(500).send("Failed to get quote");
    console.log(err);
  }
})

module.exports = getQuote