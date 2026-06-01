const db = require('../config/database');

const createLog = async (userId, activity) => {
  const [result] = await db.execute(
    'INSERT INTO activity_logs (user_id, activity) VALUES (?, ?)',
    [userId, activity]
  );
  return result.insertId;
};

const getLogs = async () => {
  const [rows] = await db.execute('SELECT * FROM activity_logs ORDER BY created_at DESC');
  return rows;
};

module.exports = {
  createLog,
  getLogs
};
