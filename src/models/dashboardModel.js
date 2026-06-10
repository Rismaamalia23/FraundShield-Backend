const db = require('../config/database');

/** Mengambil ringkasan statistik (dashboard metrics) secara menyeluruh */
const getStatistics = async () => {
  const [[{ total_transactions }]] = await db.execute('SELECT COUNT(*) as total_transactions FROM transactions');
  const [[{ total_transaction_amount }]] = await db.execute('SELECT COALESCE(SUM(amount), 0) as total_transaction_amount FROM transactions');
  
  const [[{ suspicious_transactions }]] = await db.execute('SELECT COUNT(*) as suspicious_transactions FROM transactions WHERE status = "suspicious"');
  const [[{ blocked_transactions }]] = await db.execute('SELECT COUNT(*) as blocked_transactions FROM transactions WHERE status = "blocked"');
  const [[{ total_blocked_amount }]] = await db.execute('SELECT COALESCE(SUM(amount), 0) as total_blocked_amount FROM transactions WHERE status = "blocked"');
  const [[{ normal_transactions }]] = await db.execute('SELECT COUNT(*) as normal_transactions FROM transactions WHERE status = "normal"');
  const [[{ reviewed_transactions }]] = await db.execute('SELECT COUNT(*) as reviewed_transactions FROM transactions WHERE status = "reviewed"');
  
  const [[{ total_users }]] = await db.execute('SELECT COUNT(*) as total_users FROM users WHERE role = "user"');
  const [[{ total_analysts }]] = await db.execute('SELECT COUNT(*) as total_analysts FROM users WHERE role = "analyst"');
  const [[{ total_rules }]] = await db.execute('SELECT COUNT(*) as total_rules FROM fraud_rules');
  
  const [[{ total_investigations }]] = await db.execute('SELECT COUNT(*) as total_investigations FROM investigations');
  const [[{ pending_investigations }]] = await db.execute('SELECT COUNT(*) as pending_investigations FROM investigations WHERE review_status = "pending"');
  const [[{ resolved_investigations }]] = await db.execute('SELECT COUNT(*) as resolved_investigations FROM investigations WHERE review_status = "resolved"');
  const [[{ escalated_investigations }]] = await db.execute('SELECT COUNT(*) as escalated_investigations FROM investigations WHERE review_status = "escalated"');
  return {
    total_transactions: parseInt(total_transactions),
    total_transaction_amount: parseFloat(total_transaction_amount),
    normal_transactions: parseInt(normal_transactions),
    suspicious_transactions: parseInt(suspicious_transactions),
    blocked_transactions: parseInt(blocked_transactions),
    total_blocked_amount: parseFloat(total_blocked_amount),
    reviewed_transactions: parseInt(reviewed_transactions),
    total_users: parseInt(total_users),
    total_analysts: parseInt(total_analysts),
    total_rules: parseInt(total_rules),
    total_investigations: parseInt(total_investigations),
    pending_investigations: parseInt(pending_investigations),
    resolved_investigations: parseInt(resolved_investigations),
    escalated_investigations: parseInt(escalated_investigations)
  };
};

module.exports = {
  getStatistics
};
