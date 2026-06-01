const db = require('../config/database');

const createInvestigation = async (investigationData) => {
  const { transaction_id, analyst_id, note, review_status } = investigationData;
  const [result] = await db.execute(
    'INSERT INTO investigations (transaction_id, analyst_id, note, review_status) VALUES (?, ?, ?, ?)',
    [transaction_id, analyst_id, note, review_status || 'pending']
  );
  return result.insertId;
};

const getInvestigations = async () => {
  const [rows] = await db.execute('SELECT * FROM investigations ORDER BY created_at DESC');
  return rows;
};

const getInvestigationById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM investigations WHERE id = ?', [id]);
  return rows[0];
};

const updateInvestigationStatus = async (id, review_status) => {
  const [result] = await db.execute('UPDATE investigations SET review_status = ? WHERE id = ?', [review_status, id]);
  return result;
};

const updateInvestigation = async (id, investigationData) => {
  const { transaction_id, analyst_id, note, review_status } = investigationData;
  const [result] = await db.execute(
    'UPDATE investigations SET transaction_id = ?, analyst_id = ?, note = ?, review_status = ? WHERE id = ?',
    [transaction_id, analyst_id, note, review_status, id]
  );
  return result;
};

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
