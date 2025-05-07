const express = require("express");
const submitInvoice = express.Router();
const db = require("../../models");
const { Quote, QuoteDetails, Invoice, InvoiceDetail } = db;

submitInvoice.post("/:id/submit-as-invoice", async (req, res) => {
    const quoteId = parseInt(req.params.id, 10);
    const t = await db.sequelize.transaction();

    if (isNaN(quoteId)) {
        return res.status(400).json({ error: "Invalid quote ID" });
    }
    try {
    // Step 1: Fetch the quote
    const quote = await Quote.findByPk(quoteId, { transaction: t });
    if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
    }

    // Step 2: Create invoice
    const invoice = await Invoice.create({
        quote_no: quote.id,
        date: quote.date,
        customer: quote.customer,
        sub_total: quote.sub_total,
        total: quote.total,
    }, { transaction: t });

    // Step 3: Fetch quote details
    const details = await QuoteDetails.findAll({
        where: { quote_id: quoteId },
        transaction: t
    });

    // Step 4: Copy quote details into invoice details
    const invoiceDetails = details.map(detail => ({
        invoice_id: invoice.id,
        material: detail.material,
        product_type: detail.product_type,
        CL: detail.CL,
        unit: detail.unit,
        width: detail.width,
        height: detail.height,
        at: detail.at,
        GL: detail.GL,
        GRD: detail.GRD,
        SC: detail.SC,
    }));

    await InvoiceDetail.bulkCreate(invoiceDetails, { transaction: t });

    // Optional Step 5: Mark quote as invoiced (requires a column)
    // await quote.update({ is_invoiced: true }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: "Quote submitted as invoice." });

    } catch (error) {
    await t.rollback();
    console.error("Submit as invoice error:", error);
    res.status(500).json({ error: "Failed to submit quote as invoice" });
    }
    });

    module.exports = submitInvoice;
