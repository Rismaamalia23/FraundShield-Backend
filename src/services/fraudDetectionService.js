const transactionModel = require('../models/transactionModel');
const fraudRuleModel = require('../models/fraudRuleModel');

/**
 * Menghitung skor risiko fraud berdasarkan aturan (rules) yang aktif di database.
 * 
 * INPUT:
 * transactionData = {
 *   user_id: 4,
 *   amount: 15000000,
 *   location: "Jakarta",
 *   transaction_time: "2026-06-11T02:00:00.000Z"
 * }
 * 
 * OUTPUT:
 * score = 75 (berupa angka akumulasi risk_point dari aturan yang terpicu)
 */
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
        // Terpicu jika nominal transaksi di atas Rp 10.000.000
        if (parseFloat(amount) > 10000000) score += rule.risk_point;
        break;

      case 'high_frequency':
        // Terpicu jika user sudah melakukan transaksi > 5 kali
        if (txCount > 5) score += rule.risk_point;
        break;

      case 'location':
        // Terpicu jika lokasi saat ini berbeda dengan lokasi transaksi terakhir nasabah
        if (lastLocationInfo && lastLocationInfo.location && location) {
          if (lastLocationInfo.location.toLowerCase() !== location.toString().toLowerCase()) {
            score += rule.risk_point;
          }
        }
        break;

      case 'night_time':
        // Terpicu jika transaksi dilakukan pada jam malam (00:00 - 04:00)
        if (hour >= 0 && hour <= 4) score += rule.risk_point;
        break;
        
      default:
        // Jika condition_type tidak dikenali sistem, abaikan.
        break;
    }
  }

  return score;
};

/**
 * Menentukan status akhir transaksi berdasarkan skor risiko.
 * 
 * INPUT:
 * score = 75 (angka total skor risiko)
 * 
 * OUTPUT:
 * status = "blocked", "suspicious", atau "normal" (string)
 */
const determineStatus = (score) => {
  if (score >= 70) return 'blocked';
  if (score >= 40) return 'suspicious';
  return 'normal';
};

/**
 * Mengevaluasi transaksi secara menyeluruh (skor risiko + status akhir).
 * 
 * INPUT:
 * transactionData = { user_id, amount, location, transaction_time }
 * 
 * OUTPUT:
 * {
 *   risk_score: 75,
 *   status: "blocked"
 * }
 */
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
