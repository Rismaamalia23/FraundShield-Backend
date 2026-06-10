const db = require('../config/database');

/** Membuat aturan deteksi fraud baru di database */
const createFraudRule = async (ruleData) => {
  const { rule_name, condition_type, risk_point } = ruleData;
  const [result] = await db.execute(
    'INSERT INTO fraud_rules (rule_name, condition_type, risk_point) VALUES (?, ?, ?)',
    [rule_name, condition_type, risk_point]
  );
  return result.insertId;
};

/** Mengambil daftar seluruh aturan deteksi fraud */
const getFraudRules = async () => {
  const [rows] = await db.execute('SELECT * FROM fraud_rules ORDER BY id ASC');
  return rows;
};

/** Mendapatkan aturan deteksi fraud berdasarkan ID */
const getFraudRuleById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM fraud_rules WHERE id = ?', [id]);
  return rows[0];
};

/** Memperbarui aturan deteksi fraud yang sudah ada */
const updateFraudRule = async (id, ruleData) => {
  const { rule_name, condition_type, risk_point } = ruleData;
  const [result] = await db.execute(
    'UPDATE fraud_rules SET rule_name = ?, condition_type = ?, risk_point = ? WHERE id = ?',
    [rule_name, condition_type, risk_point, id]
  );
  return result;
};

/** Menghapus aturan deteksi fraud berdasarkan ID */
const deleteFraudRule = async (id) => {
  const [result] = await db.execute('DELETE FROM fraud_rules WHERE id = ?', [id]);
  return result;
};

module.exports = {
  createFraudRule,
  getFraudRules,
  getFraudRuleById,
  updateFraudRule,
  deleteFraudRule
};
