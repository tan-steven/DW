const express = require('express');
const router = express.Router();
const db = require('../../models');
const { Invoice, InvoiceDetail, Order, OrderDetail, Quote, QuoteDetail } = db;
const { encodeQuoteNumber, decodeQuoteNumber } = require('../../utils/quoteNum');

router.post('/:quote_no/submit-as-invoice', async (req, res) => {
  const orderId = req.params.quote_no;
  const t = await db.sequelize.transaction();

  try {
    const order = await Order.findOne({
      where: { id: orderId },
      transaction: t
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }

    const oldQuoteNo = BigInt(order.quote_no);
    const { customerId, major, minor } = decodeQuoteNumber(oldQuoteNo);
    const newQuoteNo = encodeQuoteNumber(customerId, 2n, major, minor);
    // Update quote + order quote_no fields to new one with status 2
    await Quote.update(
      { quote_no: newQuoteNo },
      { where: { quote_no: oldQuoteNo }, transaction: t }
    );

    await Order.update(
      { quote_no: newQuoteNo },
      { where: { quote_no: oldQuoteNo }, transaction: t }
    );
    
    await OrderDetail.update(
      { order_id: newQuoteNo },
      { where: { order_id: oldQuoteNo }, transaction: t }
    );

    // Create invoice
    const invoice = await Invoice.create({
      quote_no: newQuoteNo,
      date: order.date,
      customer: order.customer,
      sub_total: order.sub_total,
      total: order.total
    }, { transaction: t });

    // Copy details from order_details using new quote_no
    const details = await OrderDetail.findAll({
      where: { order_id: newQuoteNo },
      transaction: t
    });

    const invoiceDetails = details.map(detail => ({
      invoice_id: newQuoteNo,
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
    res.json({ message: "Order submitted as invoice.", new_quote_no: newQuoteNo.toString() });
  } catch (err) {
    await t.rollback();
    console.error("Submit as invoice error:", err);
    res.status(500).send("Failed to submit order as invoice.");
  }
});

module.exports = router;
