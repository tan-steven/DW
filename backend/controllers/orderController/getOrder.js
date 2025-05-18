const express = require('express');
const order = express.Router();
const { Order } = require('../../models');

order.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).send("Failed to fetch orders");
  }
});

module.exports = order;
