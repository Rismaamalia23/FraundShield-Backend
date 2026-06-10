const db = require('../config/database');

/** Membuat investigasi transaksi baru */
const createInvestigation = async (investigationData) => {
  const { transaction_id, analyst_id, note, review_status } = investigationData;
  const [result] = await db.execute(
    'INSERT INTO investigations (transaction_id, analyst_id, note, review_status) VALUES (?, ?, ?, ?)',
    [transaction_id, analyst_id, note, review_status || 'pending']
  );
  return result.insertId;
};

/** Mengambil seluruh data investigasi */
const getInvestigations = async () => {
  const [rows] = await db.execute('SELECT * FROM investigations ORDER BY created_at DESC');
  return rows;
};

/** Mendapatkan detail investigasi berdasarkan ID */
const getInvestigationById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM investigations WHERE id = ?', [id]);
  return rows[0];
};

/** Memperbarui status review investigasi */
const updateInvestigationStatus = async (id, review_status) => {
  const [result] = await db.execute('UPDATE investigations SET review_status = ? WHERE id = ?', [review_status, id]);
  return result;
};

/** Memperbarui data investigasi secara lengkap */
const updateInvestigation = async (id, investigationData) => {
  const { transaction_id, analyst_id, note, review_status } = investigationData;
  const [result] = await db.execute(
    'UPDATE investigations SET transaction_id = ?, analyst_id = ?, note = ?, review_status = ? WHERE id = ?',
    [transaction_id, analyst_id, note, review_status, id]
  );
  return result;
};

/** Menghapus data investigasi berdasarkan ID */
const deleteInvestigation = async (id) => {
  const [result] = await db.execute('DELETE FROM investigations WHERE id = ?', [id]);
  return result;
};

module.exports = {
  createInvestigation,
  getInvestigations,
  getInvestigationById,
  updateInvestigationStatus,
  updateInvestigation,
  deleteInvestigation
};
