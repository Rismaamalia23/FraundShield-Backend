const userModel = require('../models/userModel');

/** Mendapatkan Daftar Seluruh User (GET /api/users) */
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data seluruh user',
      data: users
    });
  } catch (error) {
    console.error('Error saat get all users:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil data user',
      data: null
    });
  }
};

/** Memperbarui Role Pengguna (PUT /api/users/:id/role) */
const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    // Validasi input role
    if (!role || !['admin', 'analis', 'user'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role tidak valid. Gunakan: admin, analis, atau user',
        data: null
      });
    }

    // Cek apakah user eksis
    const existingUser = await userModel.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    // Update role
    await userModel.updateRoleById(userId, role);

    res.status(200).json({
      success: true,
      message: 'Role berhasil diperbarui'
    });
  } catch (error) {
    console.error('Error saat update role:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat update role',
      data: null
    });
  }
};

/** Menghapus Pengguna Berdasarkan ID (DELETE /api/users/:id) */
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Cek apakah user ada
    const existingUser = await userModel.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    // Eksekusi delete
    await userModel.deleteUserById(userId);

    res.status(200).json({
      success: true,
      message: 'User berhasil dihapus',
      data: null
    });
  } catch (error) {
    console.error('Error saat delete user:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat menghapus user',
      data: null
    });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser
};
