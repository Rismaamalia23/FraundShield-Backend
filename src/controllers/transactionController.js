const transactionModel = require('../models/transactionModel');
const fraudDetectionService = require('../services/fraudDetectionService');
const activityLogModel = require('../models/activityLogModel');

/**
 * Membuat Transaksi Baru dan Mendeteksi Fraud Secara Real-time.
 * 
 * METHOD: POST
 * URL: /api/transactions
 * ACCESS: Admin, User (Nasabah)
 * 
 * INPUT (req.body):
 * {
 *   "category_id": 1,
 *   "amount": 5000000000,
 *   "location": "India",
 *   "transaction_time": "2026-06-01 00:00:00" (opsional)
 * }
 * 
 * OUTPUT (res.json):
 * {
 *   "success": true,
 *   "message": "Transaksi berhasil dibuat",
 *   "data": {
 *     "id": 19,
 *     "user_id": 4,
 *     "category_id": 1,
 *     "amount": 5000000000,
 *     "location": "India",
 *     "risk_score": 75,
 *     "status": "blocked"
 *   }
 * }
 */
const createTransaction = async (req, res, next) => {
  try {
    const { category_id, amount, location, transaction_time } = req.body;
    const user_id = req.user.id;

    // Validasi input
    if (category_id === undefined || amount === undefined || !location) {
      return res.status(400).json({
        success: false,
        message: 'Field category_id, amount, dan location harus diisi',
        data: null
      });
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'amount harus berupa angka yang valid dan lebih besar dari 0',
        data: null
      });
    }

    // Fraud Detection
    const { risk_score, status } = await fraudDetectionService.evaluateTransaction({
      user_id,
      amount,
      location,
      transaction_time: transaction_time || new Date()
    });

    const transactionId = await transactionModel.createTransaction({
      user_id,
      category_id,
      amount,
      location,
      transaction_time: transaction_time || new Date(),
      risk_score,
      status
    });

    await activityLogModel.createLog(user_id, `Created transaction ID: ${transactionId} with status: ${status}`);

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil dibuat',
      data: {
        id: transactionId,
        user_id,
        category_id,
        amount,
        location,
        risk_score,
        status
      }
    });
  } catch (error) {
    if (error.message && error.message.includes('foreign key constraint fails')) {
      return res.status(400).json({
        success: false,
        message: 'Gagal membuat transaksi: category_id tidak valid atau user_id tidak valid',
        data: null
      });
    }
    next(error);
  }
};

/**
 * Mendapatkan Daftar Riwayat Transaksi.
 * 
 * METHOD: GET
 * URL: /api/transactions
 * ACCESS: Admin, Analyst, User
 * 
 * INPUT: None (Menggunakan query param jika ada filter, tapi default kosong)
 * 
 * OUTPUT (res.json):
 * {
 *   "success": true,
 *   "message": "Berhasil mengambil data transaksi",
 *   "data": [
 *     {
 *       "id": 19,
 *       "user_id": 4,
 *       "category_id": 1,
 *       "amount": "5000000000.00",
 *       "location": "India",
 *       "risk_score": 75,
 *       "status": "blocked",
 *       "created_at": "2026-06-11T01:00:00.000Z"
 *     }
 *   ]
 * }
 */
const getTransactions = async (req, res, next) => {
  try {
    // Validasi query parameter page
    if (req.query.page !== undefined) {
      const pageVal = parseInt(req.query.page);
      if (isNaN(pageVal) || pageVal < 1) {
        return res.status(400).json({
          success: false,
          message: 'page harus berupa angka minimal 1',
          data: null
        });
      }
    }

    // Validasi query parameter limit
    if (req.query.limit !== undefined) {
      const limitVal = parseInt(req.query.limit);
      if (isNaN(limitVal) || limitVal < 1 || limitVal > 100) {
        return res.status(400).json({
          success: false,
          message: 'limit harus berupa angka antara 1 dan 100',
          data: null
        });
      }
    }

    const page = req.query.page !== undefined ? parseInt(req.query.page) : 1;
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 10;
    const offset = (page - 1) * limit;

    let filters = {
      limit,
      offset
    };

    // Jika user biasa yang login, mereka hanya boleh melihat transaksi miliknya sendiri
    if (req.user.role === 'user') {
      filters.user_id = req.user.id;
    }

    if (req.query.status) {
      filters.status = req.query.status;
    }

    if (req.query.search) {
      filters.search = req.query.search;
    }

    const total_data = await transactionModel.getTransactionCount(filters);
    const transactions = await transactionModel.getTransactions(filters);
    const total_pages = Math.ceil(total_data / limit);

    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data transaksi',
      pagination: {
        current_page: page,
        limit: limit,
        total_data: total_data,
        total_pages: total_pages
      },
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Memperbarui Status Transaksi (Manual Override).
 * 
 * METHOD: PUT
 * URL: /api/transactions/:id
 * ACCESS: Admin, Analyst
 * 
 * INPUT (req.body):
 * {
 *   "status": "reviewed"
 * }
 * 
 * OUTPUT (res.json):
 * {
 *   "success": true,
 *   "message": "Status transaksi berhasil diupdate",
 *   "data": {
 *     "id": 19,
 *     "status": "reviewed"
 *   }
 * }
 */
const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, amount, location, category_id, transaction_time } = req.body;

    // 1. Tolak jika ada upaya mengubah detail transaksi (amount, location, dll)
    if (amount !== undefined || location !== undefined || category_id !== undefined || transaction_time !== undefined) {
      return res.status(400).json({
        success: false,
        message: 'Detail transaksi (amount, location, category_id, transaction_time) bersifat permanen dan tidak dapat diubah',
        data: null
      });
    }

    // 2. Pastikan status dikirim
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Field status harus diisi untuk melakukan update status transaksi',
        data: null
      });
    }

    const existing = await transactionModel.getTransactionById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan', data: null });
    }

    const validStatuses = ['normal', 'suspicious', 'blocked', 'reviewed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid', data: null });
    }

    await transactionModel.updateTransactionStatus(id, status);
    await activityLogModel.createLog(req.user.id, `Updated transaction ID: ${id} status to: ${status}`);

    res.status(200).json({
      success: true,
      message: 'Status transaksi berhasil diupdate',
      data: { id: parseInt(id), status }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Menghapus Transaksi Dari Sistem.
 * 
 * METHOD: DELETE
 * URL: /api/transactions/:id
 * ACCESS: Admin
 * 
 * INPUT: None
 * 
 * OUTPUT (res.json):
 * {
 *   "success": true,
 *   "message": "Transaksi berhasil dihapus",
 *   "data": null
 * }
 */
const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const existing = await transactionModel.getTransactionById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan', data: null });
    }

    await transactionModel.deleteTransaction(id);
    await activityLogModel.createLog(req.user.id, `Deleted transaction ID: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Transaksi berhasil dihapus',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
};
