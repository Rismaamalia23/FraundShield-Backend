const categoryModel = require('../models/categoryModel');
const activityLogModel = require('../models/activityLogModel');

/** Membuat Kategori Transaksi Baru (POST /api/categories) */
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const categoryId = await categoryModel.createCategory({ name, description });
    await activityLogModel.createLog(req.user.id, `Created category ID: ${categoryId}`);

    res.status(201).json({
      success: true,
      message: 'Kategori berhasil dibuat',
      data: { id: categoryId, name, description }
    });
  } catch (error) {
    next(error);
  }
};

/** Mendapatkan Daftar Semua Kategori Transaksi (GET /api/categories) */
const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.getCategories();
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data kategori',
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/** Menghapus Kategori Transaksi Berdasarkan ID (DELETE /api/categories/:id) */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const existing = await categoryModel.getCategoryById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan', data: null });
    }

    await categoryModel.deleteCategory(id);
    await activityLogModel.createLog(req.user.id, `Deleted category ID: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Kategori berhasil dihapus',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/** Memperbarui Kategori Transaksi Berdasarkan ID (PUT /api/categories/:id) */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama kategori harus diisi', data: null });
    }

    const existing = await categoryModel.getCategoryById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan', data: null });
    }

    await categoryModel.updateCategory(id, { name, description });
    await activityLogModel.createLog(req.user.id, `Updated category ID: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Kategori berhasil diupdate',
      data: { id: parseInt(id), name, description }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory
};
