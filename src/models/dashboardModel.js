const db = require('../config/database');

const getStatistics = async () => {
  const [[{ total_transactions }]] = await db.execute('SELECT COUNT(*) as total_transactions FROM transactions');
  const [[{ suspicious_transactions }]] = await db.execute('SELECT COUNT(*) as suspicious_transactions FROM transactions WHERE status = "suspicious"');
  const [[{ blocked_transactions }]] = await db.execute('SELECT COUNT(*) as blocked_transactions FROM transactions WHERE status = "blocked"');
  const [[{ pending_investigations }]] = await db.execute('SELECT COUNT(*) as pending_investigations FROM investigations WHERE review_status = "pending"');

  return {
    total_transactions,
    suspicious_transactions,
    blocked_transactions,
    pending_investigations
  };
};

module.exports = {
  getStatistics
};
