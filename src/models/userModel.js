const db = require('../config/database');

const createUser = async (userData) => {
  const { name, email, password, role = 'user' } = userData;
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
  return result.insertId;
};

const getUserByEmail = async (email) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

const getAllUsers = async () => {
  const [rows] = await db.execute(
    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
  );
  return rows;
};

const getUserById = async (id) => {
  const [rows] = await db.execute(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

const updateRoleById = async (id, role) => {
  const [result] = await db.execute(
    'UPDATE users SET role = ? WHERE id = ?',
    [role, id]
  );
  return result;
};

const updatePasswordById = async (id, hashedPassword) => {
  const [result] = await db.execute(
    'UPDATE users SET password = ? WHERE id = ?',
    [hashedPassword, id]
  );
  return result;
};

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
