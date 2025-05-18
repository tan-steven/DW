const express = require('express');
const getOrderDetails = express.Router();
const db = require('../../models');
const { OrderDetail } = db;

getOrderDetails.get('/:order_id', async (req, res) => {
  try{
    const { order_id } = req.params;
    const details = await OrderDetail.findAll({where: { order_id }});
    res.json(details);
  } catch (err){
    console.log("Error fetching order details:", err);
    res.status(500).send("Failed to fetch order details");
  }
});

module.exports = getOrderDetails;
