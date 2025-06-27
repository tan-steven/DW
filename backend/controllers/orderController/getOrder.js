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

order.get('/quote-no/:quote_no', async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { quote_no: req.params.quote_no },
    });
    if (!order) {
      return res.status(404).send("Quote not found");
    }
    res.json(order);
  } catch (err) {
    res.status(500).send("Failed to get quote");
    console.log(err);
  }
})

module.exports = order;