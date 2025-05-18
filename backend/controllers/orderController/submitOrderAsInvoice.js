const express = require("express");
const SubmitToInvoice = express.Router();
const db = require("../../models");
const { Order, OrderDetail, Invoice, InvoiceDetail } = db;

SubmitToInvoice.post("/:id/submit-as-invoice", async (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  const t = await db.sequelize.transaction();

  try {
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const order = await Order.findByPk(orderId, { transaction: t });
    if (!order) return res.status(404).json({ error: "Order not found" });

    const invoice = await Invoice.create({
      quote_no: order.quote_no,
      date: order.date,
      customer: order.customer,
      sub_total: order.sub_total,
      total: order.total,
    }, { transaction: t });

    const details = await OrderDetail.findAll({
      where: { order_id: orderId },
      transaction: t,
    });

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

    await t.commit();
    res.status(200).json({ message: "Order submitted as invoice." });

  } catch (err) {
    await t.rollback();
    console.error("Submit order as invoice error:", err);
    res.status(500).send("Failed to submit order as invoice");
  }
});

module.exports = SubmitToInvoice;
