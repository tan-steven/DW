const express = require("express");
const getInvoiceDetails = express.Router();
const db = require("../../models");
const { InvoiceDetail } = db;

getInvoiceDetails.get("/:invoice_id", async (req, res) => {
  try {
    const { invoice_id } = req.params;
    const details = await InvoiceDetail.findAll({ where: { invoice_id } });
    res.json(details);
  } catch (err) {
    console.error("Error fetching invoice details:", err);
    res.status(500).send("Failed to fetch invoice details");
  }
});

module.exports = getInvoiceDetails;
