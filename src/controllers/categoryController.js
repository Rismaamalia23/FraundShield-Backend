const categoryModel = require('../models/categoryModel');
const activityLogModel = require('../models/activityLogModel');

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

module.exports = {
  createCategory,
  getCategories
};
