const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: '1d' // Token expires in 1 day
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
