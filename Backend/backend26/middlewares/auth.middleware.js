
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const requireAuth = async (req, res, next) => {
  const token = req.cookies?.jwt_token;

  if (!token) {
    return res.status(401).json({ message: 'token not found' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await userModel.findById(decodedToken.id);

    if (!user) {
      return res.status(401).json({ message: 'utilisateur introuvable' });
    }

    req.user = user;
    req.session.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'probleme decoding token' });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: 'Accès refusé' });
  }
  next();
};

module.exports = { requireAuth, requireRole };

         