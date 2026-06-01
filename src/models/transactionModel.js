const db = require('../config/database');

const createTransaction = async (transactionData) => {
  const { user_id, category_id, amount, location, transaction_time, risk_score, status } = transactionData;
  const [result] = await db.execute(
    'INSERT INTO transactions (user_id, category_id, amount, location, transaction_time, risk_score, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [user_id, category_id, amount, location, transaction_time, risk_score, status]
  );
  return result.insertId;
};

const getTransactions = async (filters = {}) => {
  let query = 'SELECT * FROM transactions WHERE 1=1';
  let params = [];
  
  if (filters.user_id) {
    query += ' AND user_id = ?';
    params.push(filters.user_id);
  }
  
  query += ' ORDER BY created_at DESC';
  
  const [rows] = await db.execute(query, params);
  return rows;
};

const getTransactionById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM transactions WHERE id = ?', [id]);
  return rows[0];
};

const updateTransactionStatus = async (id, status) => {
  const [result] = await db.execute('UPDATE transactions SET status = ? WHERE id = ?', [status, id]);
  return result;
};

const updateTransactionDetails = async (id, data) => {
  const { category_id, amount, location, transaction_time, risk_score, status } = data;
  const [result] = await db.execute(
    'UPDATE transactions SET category_id = ?, amount = ?, location = ?, transaction_time = ?, risk_score = ?, status = ? WHERE id = ?',
    [category_id, amount, location, transaction_time, risk_score, status, id]
  );
  return result;
};

const deleteTransaction = async (id) => {
  const [result] = await db.execute('DELETE FROM transactions WHERE id = ?', [id]);
  return result;
};

const getTransactionCountByUser = async (user_id) => {
  const [rows] = await db.execute('SELECT COUNT(*) as count FROM transactions WHERE user_id = ?', [user_id]);
  return rows[0].count;
};

const getLastTransactionLocation = async (user_id) => {
  const [rows] = await db.execute('SELECT location FROM transactions WHERE user_id = ? ORDER BY transaction_time DESC LIMIT 1', [user_id]);
  return rows[0];
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransactionStatus,
  updateTransactionDetails,
  deleteTransaction,
  getTransactionCountByUser,
  getLastTransactionLocation
};
