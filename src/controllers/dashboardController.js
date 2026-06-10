const dashboardModel = require('../models/dashboardModel');
const activityLogModel = require('../models/activityLogModel');

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

const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await activityLogModel.getLogs();
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil riwayat aktivitas user',
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getActivityLogs
};
