const express = require('express');
const router = express.Router();
const { Quote, QuoteDetails, Order, OrderDetail } = require('../../models');
const { encodeQuoteNumber, decodeQuoteNumber } = require('../../utils/quoteNum');

router.post('/:id/submit-as-order', async (req, res) => {
  const quoteId = BigInt(req.params.id);
  const t = await require('../../models').sequelize.transaction();

  try {
    const quote = await Quote.findOne({
      where: { quote_no: quoteId },
      transaction: t
    });

    if (!quote) {
      await t.rollback();
      return res.status(404).json({ message: "Quote not found" });
    }

    const originalQuoteNo = quote.quote_no; // Save before updating

    // Decode and regenerate quote_no with status = 1 (order)
    const { customerId, major, minor } = decodeQuoteNumber(originalQuoteNo);
    const updatedQuoteNo = encodeQuoteNumber(customerId, 1n, major, minor);

    // Update the quote number (to reflect it's now an order)
    quote.quote_no = updatedQuoteNo;
    await quote.save({ transaction: t });

    // Create the order (storing updated quote_no)
    const order = await Order.create({
      quote_no: updatedQuoteNo,
      date: quote.date,
      customer: quote.customer,
      sub_total: quote.sub_total,
      total: quote.total
    }, { transaction: t });

    // Fetch details using the original quote number
    const details = await QuoteDetails.findAll({
      where: { quote_id: updatedQuoteNo },
      transaction: t
    });

    // Create order details that use the new quote_no as order_id
    const orderDetails = details.map(detail => ({
      order_id: updatedQuoteNo, // ✅ store updated quote number here
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

    await OrderDetail.bulkCreate(orderDetails, { transaction: t });

    await t.commit();
    res.json({ message: "Quote submitted as order.", new_quote_no: updatedQuoteNo.toString() });
  } catch (err) {
    await t.rollback();
    console.error("Submit as order error:", err.message, err.stack);
    res.status(500).send("Failed to submit order");
  }
});

module.exports = router;
