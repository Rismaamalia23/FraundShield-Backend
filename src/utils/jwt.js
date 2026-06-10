const jwt = require('jsonwebtoken');

/** Membuat/generate JWT Token baru */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: '1d' // Token expires in 1 day
  });
};

/** Memverifikasi keabsahan JWT Token */
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
