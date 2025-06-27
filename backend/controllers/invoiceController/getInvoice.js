const getInvoice = require('express').Router()
const db = require('../../models')
const { Invoice } = db

getInvoice.get('/', async (req, res)=>{
    try{
        const foundInvoices = await Invoice.findAll();
        res.status(200).json(foundInvoices);
    }catch(err){
        res.status(500).send("failed to get data");
        console.log(err);
    }
})

getInvoice.get('/quote-no/:quote_no', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      where: { quote_no: req.params.quote_no },
    });
    if (!invoice) {
      return res.status(404).send("Quote not found");
    }
    res.json(invoice);
  } catch (err) {
    res.status(500).send("Failed to get quote");
    console.log(err);
  }
})

module.exports = getInvoice