const express = require('express');
const customerRoute = express.Router();
const db = require('../../models');
const { Customer } = db;

// Get all Customers
customerRoute.get('/', async (req, res) => {
  try { 
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to get customer data");
  }
});

// Create a new customer
customerRoute.post('/', async (req, res) => {
  try {
    const { name, phone, address, email } = req.body;
    const newCustomer = await Customer.create({ name, phone, address, email });
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

module.exports = customerRoute;
