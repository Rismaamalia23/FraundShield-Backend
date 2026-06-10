const investigationModel = require('../models/investigationModel');
const transactionModel = require('../models/transactionModel');
const activityLogModel = require('../models/activityLogModel');

/** Membuat Investigasi Transaksi Baru oleh Analis (POST /api/investigations) */
const createInvestigation = async (req, res, next) => {
  try {
    const { transaction_id, note } = req.body;
    const analyst_id = req.user.id;

    if (!transaction_id || note === undefined || note === null || note.trim() === '') {
      return res.status(400).json({ success: false, message: 'Semua field (transaction_id, note) harus diisi dan note tidak boleh kosong', data: null });
    }

    const existingTx = await transactionModel.getTransactionById(transaction_id);
    if (!existingTx) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan', data: null });
    }

    const investigationId = await investigationModel.createInvestigation({
      transaction_id,
      analyst_id,
      note,
      review_status: 'pending'
    });
    
    // Change transaction status to reviewed
    await transactionModel.updateTransactionStatus(transaction_id, 'reviewed');

    await activityLogModel.createLog(req.user.id, `Created investigation ID: ${investigationId} for transaction ID: ${transaction_id}`);

    res.status(201).json({
      success: true,
      message: 'Investigasi berhasil dibuat',
      data: { id: investigationId, transaction_id, analyst_id, note, review_status: 'pending' }
    });
  } catch (error) {
    next(error);
  }
};

/** Mendapatkan Daftar Semua Investigasi Transaksi (GET /api/investigations) */
const getInvestigations = async (req, res, next) => {
  try {
    const investigations = await investigationModel.getInvestigations();
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data investigasi',
      data: investigations
    });
  } catch (error) {
    next(error);
  }
};

/** Memperbarui Investigasi Transaksi Berdasarkan ID (PUT /api/investigations/:id) */
const updateInvestigation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { transaction_id, note, review_status } = req.body;

    if (!transaction_id || note === undefined || note === null || note.trim() === '' || !review_status) {
      return res.status(400).json({ success: false, message: 'Semua field (transaction_id, note, review_status) harus diisi dan note tidak boleh kosong', data: null });
    }

    const existing = await investigationModel.getInvestigationById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Investigasi tidak ditemukan', data: null });
    }

    await investigationModel.updateInvestigation(id, { transaction_id, analyst_id: req.user.id, note, review_status });
    await activityLogModel.createLog(req.user.id, `Updated investigation ID: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Investigasi berhasil diupdate',
      data: { id: parseInt(id), transaction_id, analyst_id: req.user.id, note, review_status }
    });
  } catch (error) {
    next(error);
  }
};

/** Menghapus Investigasi Transaksi Berdasarkan ID (DELETE /api/investigations/:id) */
const deleteInvestigation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await investigationModel.getInvestigationById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Investigasi tidak ditemukan', data: null });
    }

    await investigationModel.deleteInvestigation(id);
    await activityLogModel.createLog(req.user.id, `Deleted investigation ID: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Investigasi berhasil dihapus',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvestigation,
  getInvestigations,
  updateInvestigation,
  deleteInvestigation
};
