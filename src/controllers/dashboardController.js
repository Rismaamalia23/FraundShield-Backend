const dashboardModel = require('../models/dashboardModel');

/**
 * Mendapatkan Statistik Dashboard Penipuan (Fraud Dashboard).
 * 
 * METHOD: GET
 * URL: /api/dashboard
 * ACCESS: Admin, Analyst
 * 
 * INPUT: None
 * 
 * OUTPUT (res.json):
 * {
 *   "success": true,
 *   "message": "Berhasil mengambil statistik dashboard",
 *   "data": {
 *     "total_transactions": 17,
 *     "total_transaction_amount": 75000000,
 *     "normal_transactions": 8,
 *     "suspicious_transactions": 8,
 *     "blocked_transactions": 1,
 *     "total_blocked_amount": 10000000,
 *     "reviewed_transactions": 0,
 *     "total_users": 4,
 *     "total_analysts": 2,
 *     "total_rules": 3,
 *     "total_investigations": 2,
 *     "pending_investigations": 1,
 *     "resolved_investigations": 1,
 *     "escalated_investigations": 0
 *   }
 * }
 */
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
