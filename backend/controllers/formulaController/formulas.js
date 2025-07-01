const express = require('express');
const formulas = express.Router();
const db = require('../../models');
const { Formula } = db;

// Get all formulas
formulas.get('/', async (req, res) => {
  const formulas = await Formula.findAll();
  res.json(formulas);
});

// Create formula
formulas.post('/', async (req, res) => {
  const formula = await Formula.create(req.body);
  res.status(201).json(formula);
});

// Update formula
formulas.put('/:id', async (req, res) => {
  const formula = await Formula.findByPk(req.params.id);
  if (!formula) return res.status(404).send("Not found");
  await formula.update(req.body);
  res.json(formula);
});

// Delete formula
formulas.delete('/:id', async (req, res) => {
  const formula = await Formula.findByPk(req.params.id);
  if (!formula) return res.status(404).send("Not found");
  await formula.destroy();
  res.sendStatus(204);
});

module.exports = formulas;
