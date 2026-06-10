const db = require('../config/database');

/** Membuat kategori transaksi baru */
const createCategory = async (categoryData) => {
  const { name, description } = categoryData;
  const [result] = await db.execute(
    'INSERT INTO categories (name, description) VALUES (?, ?)',
    [name, description]
  );
  return result.insertId;
};

/** Mengambil daftar seluruh kategori transaksi */
const getCategories = async () => {
  const [rows] = await db.execute('SELECT * FROM categories ORDER BY id ASC');
  return rows;
};

/** Mendapatkan detail kategori transaksi berdasarkan ID */
const getCategoryById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0];
};

/** Menghapus kategori transaksi berdasarkan ID */
const deleteCategory = async (id) => {
  const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows;
};

/** Memperbarui data kategori transaksi */
const updateCategory = async (id, categoryData) => {
  const { name, description } = categoryData;
  const [result] = await db.execute(
    'UPDATE categories SET name = ?, description = ? WHERE id = ?',
    [name, description, id]
  );
  return result;
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
  updateCategory
};
