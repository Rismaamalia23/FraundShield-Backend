const db = require('../config/database');

/** Membuat user baru */
const createUser = async (userData) => {
  const { name, email, password, role = 'user' } = userData;
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
  return result.insertId;
};

/** Mendapatkan user berdasarkan email */
const getUserByEmail = async (email) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

/** Mengambil seluruh user */
const getAllUsers = async () => {
  const [rows] = await db.execute(
    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
  );
  return rows;
};

/** Mendapatkan data user berdasarkan ID */
const getUserById = async (id) => {
  const [rows] = await db.execute(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

/** Memperbarui role user */
const updateRoleById = async (id, role) => {
  const [result] = await db.execute(
    'UPDATE users SET role = ? WHERE id = ?',
    [role, id]
  );
  return result;
};

/** Memperbarui password user */
const updatePasswordById = async (id, hashedPassword) => {
  const [result] = await db.execute(
    'UPDATE users SET password = ? WHERE id = ?',
    [hashedPassword, id]
  );
  return result;
};

/** Menghapus user berdasarkan ID */
const deleteUserById = async (id) => {
  const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
  return result;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateRoleById,
  updatePasswordById,
  deleteUserById
};
