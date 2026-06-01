const transactionModel = require('../models/transactionModel');

const calculateFraudScore = async (transactionData) => {
  let score = 0;
  const { user_id, amount, location, transaction_time } = transactionData;
  const time = new Date(transaction_time);

  // 1. Jika nominal transaksi > 10.000.000 -> score +40
  if (parseFloat(amount) > 10000000) {
    score += 40;
  }

  // 2. Jika frekuensi transaksi > 5 kali -> score +30
  // Note: we'll check total transactions by user or within a timeframe.
  // We'll just check total transactions as a simple condition for now, since no timeframe was specified.
  const txCount = await transactionModel.getTransactionCountByUser(user_id);
  if (txCount > 5) {
    score += 30;
  }

  // 3. Jika lokasi berbeda -> score +20
  const lastLocationInfo = await transactionModel.getLastTransactionLocation(user_id);
  if (lastLocationInfo && lastLocationInfo.location) {
    if (lastLocationInfo.location.toLowerCase() !== location.toLowerCase()) {
      score += 20;
    }
  }

  // 4. Jika transaksi jam 00.00-04.00 -> score +10
  const hour = time.getHours();
  if (hour >= 0 && hour <= 4) {
    score += 10;
  }

  return score;
};

const determineStatus = (score) => {
  if (score >= 70) return 'blocked';
  if (score >= 40) return 'suspicious';
  return 'normal';
};

const evaluateTransaction = async (transactionData) => {
  const risk_score = await calculateFraudScore(transactionData);
  const status = determineStatus(risk_score);
  return { risk_score, status };
};

module.exports = {
  evaluateTransaction,
  calculateFraudScore,
  determineStatus
};
