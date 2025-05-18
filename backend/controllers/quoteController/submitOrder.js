const express = require('express');
const router = express.Router();
const { Quote, QuoteDetails, Order, OrderDetail } = require('../../models');

router.post('/:id/submit-as-order', async (req, res) => {
  const quoteId = parseInt(req.params.id, 10);
  const t = await require('../../models').sequelize.transaction();

  try {
    const quote = await Quote.findByPk(quoteId, { transaction: t });
    if (!quote) return res.status(404).json({ error: 'Quote not found' });

    const order = await Order.create({
      quote_no: quote.id,
      date: quote.date,
      customer: quote.customer,
      sub_total: quote.sub_total,
      total: quote.total
    }, { transaction: t });

    const details = await QuoteDetails.findAll({ where: { quote_id: quoteId }, transaction: t });

    const orderDetails = details.map(detail => ({
      order_id: order.id,
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
    res.json({ message: "Quote submitted as order." });
  } catch (err) {
    await t.rollback();
    console.error("Submit as order error:", err);
    res.status(500).send("Failed to submit order");
  }
});

module.exports = router;
