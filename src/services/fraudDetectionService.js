const transactionModel = require('../models/transactionModel');
const fraudRuleModel = require('../models/fraudRuleModel');

const calculateFraudScore = async (transactionData) => {
  let score = 0;
  const { user_id, amount, location, transaction_time } = transactionData;
  const time = new Date(transaction_time);
  const hour = time.getHours();

  // 1. Ambil semua rules dari database
  const rules = await fraudRuleModel.getFraudRules();

  // 2. Siapkan data tambahan (query di luar loop agar efisien)
  const txCount = await transactionModel.getTransactionCountByUser(user_id);
  const lastLocationInfo = await transactionModel.getLastTransactionLocation(user_id);

  // 3. Evaluasi setiap rule berdasarkan condition_type (keyword)
  for (const rule of rules) {
    const type = rule.condition_type.toLowerCase();

    switch (type) {
      case 'amount_high':
        if (parseFloat(amount) > 10000000) score += rule.risk_point;
        break;

      case 'high_frequency':
        if (txCount > 5) score += rule.risk_point;
        break;

      case 'location':
        if (lastLocationInfo && lastLocationInfo.location && location) {
          if (lastLocationInfo.location.toLowerCase() !== location.toString().toLowerCase()) {
            score += rule.risk_point;
          }
        }
        break;

      case 'night_time':
        if (hour >= 0 && hour <= 4) score += rule.risk_point;
        break;
        
      default:
        // Jika condition_type tidak dikenali sistem, abaikan.
        break;
    }
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
