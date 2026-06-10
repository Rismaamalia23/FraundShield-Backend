const activityLogModel = require('../models/activityLogModel');

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
  getActivityLogs
};
