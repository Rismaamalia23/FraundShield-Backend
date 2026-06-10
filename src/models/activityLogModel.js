const db = require('../config/database');

/** Mencatat log aktivitas user baru ke database */
const createLog = async (userId, activity) => {
  const [result] = await db.execute(
    'INSERT INTO activity_logs (user_id, activity) VALUES (?, ?)',
    [userId, activity]
  );
  return result.insertId;
};

/** Mengambil seluruh data log aktivitas dengan informasi user */
const getLogs = async () => {
  const [rows] = await db.execute(`
    SELECT al.id, al.activity, al.created_at, u.name as user_name, u.role as user_role
    FROM activity_logs al
    JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
  `);
  return rows;
};

module.exports = {
  createLog,
  getLogs
};
