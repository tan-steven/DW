const jwt = require('jsonwebtoken');
const db = require('../models');
const { User, Role } = db;

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // contains id, email, roles
    next();
  });
};

module.exports = { authenticateJWT };

module.exports = { authenticateJWT };
