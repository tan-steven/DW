const quote = require('express').Router()
const db = require('../models')
const { Quote } = db

quote.get('/', async (req, res)=>{
    try{
        const foundQuotes = await Quote.findAll()
        res.status(200).json(foundQuotes)
    }catch(err){
        res.status(500).send("failed to get data")
        console.log(err)
    }
})

module.exports = quote