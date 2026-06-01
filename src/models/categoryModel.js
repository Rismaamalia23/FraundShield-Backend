const db = require('../config/database');

const createCategory = async (categoryData) => {
  const { name, description } = categoryData;
  const [result] = await db.execute(
    'INSERT INTO categories (name, description) VALUES (?, ?)',
    [name, description]
  );
  return result.insertId;
};

const getCategories = async () => {
  const [rows] = await db.execute('SELECT * FROM categories ORDER BY id ASC');
  return rows;
};

const getCategoryById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0];
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById
};
