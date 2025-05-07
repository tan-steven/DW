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

module.exports = getInvoice