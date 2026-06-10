const transactionModel = require('../models/transactionModel');
const fraudDetectionService = require('../services/fraudDetectionService');
const activityLogModel = require('../models/activityLogModel');

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

const getTransactions = async (req, res, next) => {
  try {
    let filters = {};
    // If user role is 'user', they can only see their own transactions
    if (req.user.role === 'user') {
      filters.user_id = req.user.id;
    }

    const transactions = await transactionModel.getTransactions(filters);

    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data transaksi',
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, amount, location, category_id, transaction_time } = req.body;

    const existing = await transactionModel.getTransactionById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan', data: null });
    }

    // Jika user biasa yang login, pastikan ini transaksi miliknya
    if (req.user.role === 'user' && existing.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Akses ditolak: Hanya dapat mengubah transaksi sendiri', data: null });
    }

    // Skenario 1: Update Status (Hanya untuk Admin / Analyst)
    if (status) {
      if (req.user.role === 'user') {
        return res.status(403).json({ success: false, message: 'User tidak diizinkan mengubah status transaksi secara manual', data: null });
      }

      const validStatuses = ['normal', 'suspicious', 'blocked', 'reviewed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Status tidak valid', data: null });
      }

      await transactionModel.updateTransactionStatus(id, status);
      await activityLogModel.createLog(req.user.id, `Updated transaction ID: ${id} status to: ${status}`);

      return res.status(200).json({
        success: true,
        message: 'Status transaksi berhasil diupdate',
        data: { id: parseInt(id), status }
      });
    }

    // Skenario 2: Update Data Transaksi (amount, location, dll)
    // Jika amount/location diubah, fraud score harus dihitung ulang!
    if (amount || location || category_id || transaction_time) {
      const newAmount = amount || existing.amount;
      const newLocation = location || existing.location;
      const newTime = transaction_time || existing.transaction_time;
      const newCat = category_id || existing.category_id;

      const { risk_score, status: newStatus } = await fraudDetectionService.evaluateTransaction({
        user_id: existing.user_id,
        amount: newAmount,
        location: newLocation,
        transaction_time: newTime
      });

      await transactionModel.updateTransactionDetails(id, {
        category_id: newCat,
        amount: newAmount,
        location: newLocation,
        transaction_time: newTime,
        risk_score,
        status: newStatus
      });

      await activityLogModel.createLog(req.user.id, `Updated transaction data ID: ${id}`);

      return res.status(200).json({
        success: true,
        message: 'Data transaksi berhasil diupdate & Fraud Score dihitung ulang',
        data: { id: parseInt(id), amount: newAmount, location: newLocation, risk_score, status: newStatus }
      });
    }

    // Jika tidak ada data yang dikirim sama sekali
    return res.status(400).json({ success: false, message: 'Tidak ada data yang diupdate', data: null });

  } catch (error) {
    next(error);
  }
};

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
