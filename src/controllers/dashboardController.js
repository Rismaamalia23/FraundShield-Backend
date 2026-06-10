const dashboardModel = require('../models/dashboardModel');

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardModel.getStatistics();
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil statistik dashboard',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
