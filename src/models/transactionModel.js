const db = require('../config/database');

/** Membuat transaksi baru */
const createTransaction = async (transactionData) => {
  const { user_id, category_id, amount, location, transaction_time, risk_score, status } = transactionData;
  const [result] = await db.execute(
    'INSERT INTO transactions (user_id, category_id, amount, location, transaction_time, risk_score, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [user_id, category_id, amount, location, transaction_time, risk_score, status]
  );
  return result.insertId;
};

/** Mengambil daftar seluruh transaksi dengan filter opsional */
const getTransactions = async (filters = {}) => {
  let query = 'SELECT * FROM transactions WHERE 1=1';
  let params = [];
  
  if (filters.user_id) {
    query += ' AND user_id = ?';
    params.push(filters.user_id);
  }

  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.search) {
    query += ' AND (location LIKE ? OR status LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  
  query += ' ORDER BY created_at DESC';

  if (filters.limit !== undefined && filters.offset !== undefined) {
    query += ' LIMIT ? OFFSET ?';
    // query parameters for LIMIT and OFFSET should be integers
    params.push(filters.limit, filters.offset);
  }
  
  const [rows] = await db.execute(query, params);
  return rows;
};

/** Menghitung jumlah seluruh transaksi dengan filter opsional */
const getTransactionCount = async (filters = {}) => {
  let query = 'SELECT COUNT(*) as count FROM transactions WHERE 1=1';
  let params = [];

  if (filters.user_id) {
    query += ' AND user_id = ?';
    params.push(filters.user_id);
  }

  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.search) {
    query += ' AND (location LIKE ? OR status LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  const [rows] = await db.execute(query, params);
  return rows[0].count;
};

/** Mendapatkan detail transaksi berdasarkan ID */
const getTransactionById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM transactions WHERE id = ?', [id]);
  return rows[0];
};

/** Memperbarui status transaksi */
const updateTransactionStatus = async (id, status) => {
  const [result] = await db.execute('UPDATE transactions SET status = ? WHERE id = ?', [status, id]);
  return result;
};

/** Memperbarui detail data transaksi */
const updateTransactionDetails = async (id, data) => {
  const { category_id, amount, location, transaction_time, risk_score, status } = data;
  const [result] = await db.execute(
    'UPDATE transactions SET category_id = ?, amount = ?, location = ?, transaction_time = ?, risk_score = ?, status = ? WHERE id = ?',
    [category_id, amount, location, transaction_time, risk_score, status, id]
  );
  return result;
};

/** Menghapus transaksi berdasarkan ID */
const deleteTransaction = async (id) => {
  const [result] = await db.execute('DELETE FROM transactions WHERE id = ?', [id]);
  return result;
};

/** Menghitung jumlah transaksi yang dilakukan oleh user tertentu */
const getTransactionCountByUser = async (user_id) => {
  const [rows] = await db.execute('SELECT COUNT(*) as count FROM transactions WHERE user_id = ?', [user_id]);
  return rows[0].count;
};

/** Mendapatkan lokasi transaksi terakhir dari user tertentu */
const getLastTransactionLocation = async (user_id) => {
  const [rows] = await db.execute('SELECT location FROM transactions WHERE user_id = ? ORDER BY transaction_time DESC LIMIT 1', [user_id]);
  return rows[0];
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionCount,
  getTransactionById,
  updateTransactionStatus,
  updateTransactionDetails,
  deleteTransaction,
  getTransactionCountByUser,
  getLastTransactionLocation
};
