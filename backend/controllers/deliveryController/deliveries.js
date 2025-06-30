const express = require("express");
const delivery = express.Router();
const db = require("../../models");
const { Delivery } = db;

delivery.post("/", async (req, res) => {
  try {
    const { invoice_no, customer, total, sub_total, date } = req.body;

    // Validate and parse invoice date
    let invoiceDate = new Date(date);
    if (!date || isNaN(invoiceDate.getTime())) {
      console.warn("Invalid or missing invoice date. Defaulting to today.");
      invoiceDate = new Date();
    }

    // Estimate delivery date = invoice date + 7 days
    const estimatedDate = new Date(invoiceDate);
    estimatedDate.setDate(invoiceDate.getDate() + 7);

    // Format as YYYY-MM-DD for DATEONLY column in Sequelize/Postgres
    const formattedDeliveryDate = estimatedDate;

    const newDelivery = await Delivery.create({
      invoice_no,
      customer,
      total,
      sub_total,
      delivery_date: formattedDeliveryDate,
    });

    res.status(201).json(newDelivery);
  } catch (err) {
    console.error("Failed to create delivery", err);
    res.status(500).send("Failed to create delivery");
  }
});


// Get all deliveries
delivery.get("/", async (req, res) => {
  try {
    const deliveries = await Delivery.findAll();
    res.json(deliveries);
  } catch (err) {
    console.error("Failed to fetch deliveries", err);
    res.status(500).send("Failed to fetch deliveries");
  }
});

// Update delivery date
delivery.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { delivery_date } = req.body;

    const delivery = await Delivery.findByPk(id);
    if (!delivery) return res.status(404).send("Delivery not found");

    const newDate = new Date(delivery_date);
    delivery.delivery_date = newDate;
    await delivery.save();

    res.json(delivery);
  } catch (err) {
    console.error("Failed to update delivery date", err);
    res.status(500).send("Failed to update delivery date");
  }
});

module.exports = delivery;
