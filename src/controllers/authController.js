const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi',
        data: null
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter',
        data: null
      });
    }


    // Cek email apakah sudah terdaftar
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar',
        data: null
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Simpan user ke database
    const role = 'user';
    const insertId = await userModel.createUser({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      success: true,
      message: 'Register berhasil',
      data: {
        id: insertId,
        name,
        email,
        role
      }
    });
  } catch (error) {
    console.error('Error saat registrasi:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat registrasi',
      data: null
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi',
        data: null
      });
    }

    // Cek apakah user ada
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
        data: null
      });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
        data: null
      });
    }

    // Buat JWT payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    // Generate token
    const token = generateToken(payload);

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      token
    });
  } catch (error) {
    console.error('Error saat login:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat login',
      data: null
    });
  }
};

const profile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Ambil data user dari database berdasarkan ID
    const user = await userModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data profile berhasil diambil',
      data: user
    });
  } catch (error) {
    console.error('Error saat mengambil profile:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil data profile',
      data: null
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email wajib diisi', data: null });
    }
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email tidak ditemukan', data: null });
    }
    
    // Buat secret khusus gabungan JWT_SECRET dan password lama
    // Hal ini memastikan token otomatis hangus setelah password dirubah
    const secret = process.env.JWT_SECRET + user.password;
    const payload = { email: user.email, id: user.id };
    const token = jwt.sign(payload, secret, { expiresIn: '15m' });
    
    // Secara ideal ini dikirim via Email. Namun kita simulasikan return ke API agar mudah dites.
    res.status(200).json({
      success: true,
      message: 'Token reset password berhasil dibuat (berlaku 15 menit)',
      data: {
        userId: user.id,
        resetToken: token
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error pada server', data: null });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userId, token, newPassword } = req.body;
    
    if (!userId || !token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap', data: null });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter', data: null });
    }

    // Ambil full user dari DB dengan pass lama untuk ngecek token secret
    const [rows] = await require('../config/database').execute('SELECT * FROM users WHERE id = ?', [userId]);
    const fullUser = rows[0];
    if (!fullUser) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan', data: null });
    }

    const secret = process.env.JWT_SECRET + fullUser.password;
    
    try {
      jwt.verify(token, secret);
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Token tidak valid atau sudah kadaluarsa', data: null });
    }

    // Hash password baru dan simpan
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await require('../models/userModel').updatePasswordById(userId, hashedPassword);

    res.status(200).json({ success: true, message: 'Password berhasil direset', data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error pada server', data: null });
  }
};

module.exports = {
  register,
  login,
  profile,
  forgotPassword,
  resetPassword
};
