const express = require('express');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');
const categoriesRoutes = require('./routes/categories');
const investigationsRoutes = require('./routes/investigations');
const fraudRulesRoutes = require('./routes/fraudRules');
const dashboardRoutes = require('./routes/dashboard');
const app = express();

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/investigations', investigationsRoutes);
app.use('/api/rules', fraudRulesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Handling undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
    data: null
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server',
    data: null
  });
});

module.exports = app;
