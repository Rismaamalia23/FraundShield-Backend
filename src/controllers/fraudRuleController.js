const fraudRuleModel = require('../models/fraudRuleModel');
const activityLogModel = require('../models/activityLogModel');

const createFraudRule = async (req, res, next) => {
  try {
    const { rule_name, condition_type, risk_point } = req.body;

    if (!rule_name || !condition_type || risk_point === undefined) {
      return res.status(400).json({ success: false, message: 'Semua field (rule_name, condition_type, risk_point) harus diisi', data: null });
    }

    if (isNaN(risk_point)) {
      return res.status(400).json({ success: false, message: 'risk_point harus berupa angka', data: null });
    }

    const ruleId = await fraudRuleModel.createFraudRule({ rule_name, condition_type, risk_point });
    await activityLogModel.createLog(req.user.id, `Created fraud rule ID: ${ruleId}`);

    res.status(201).json({
      success: true,
      message: 'Fraud rule berhasil dibuat',
      data: { id: ruleId, rule_name, condition_type, risk_point }
    });
  } catch (error) {
    next(error);
  }
};

const getFraudRules = async (req, res, next) => {
  try {
    const rules = await fraudRuleModel.getFraudRules();
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data fraud rules',
      data: rules
    });
  } catch (error) {
    next(error);
  }
};

const updateFraudRule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rule_name, condition_type, risk_point } = req.body;

    if (!rule_name || !condition_type || risk_point === undefined) {
      return res.status(400).json({ success: false, message: 'Semua field (rule_name, condition_type, risk_point) harus diisi', data: null });
    }

    if (isNaN(risk_point)) {
      return res.status(400).json({ success: false, message: 'risk_point harus berupa angka', data: null });
    }

    const existingRule = await fraudRuleModel.getFraudRuleById(id);
    if (!existingRule) {
      return res.status(404).json({ success: false, message: 'Fraud rule tidak ditemukan', data: null });
    }

    await fraudRuleModel.updateFraudRule(id, { rule_name, condition_type, risk_point });
    await activityLogModel.createLog(req.user.id, `Updated fraud rule ID: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Fraud rule berhasil diupdate',
      data: { id: parseInt(id), rule_name, condition_type, risk_point }
    });
  } catch (error) {
    next(error);
  }
};

const deleteFraudRule = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingRule = await fraudRuleModel.getFraudRuleById(id);
    if (!existingRule) {
      return res.status(404).json({ success: false, message: 'Fraud rule tidak ditemukan', data: null });
    }

    await fraudRuleModel.deleteFraudRule(id);
    await activityLogModel.createLog(req.user.id, `Deleted fraud rule ID: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Fraud rule berhasil dihapus',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFraudRule,
  getFraudRules,
  updateFraudRule,
  deleteFraudRule
};
