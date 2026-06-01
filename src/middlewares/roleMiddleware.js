const checkRole = (roles) => {
  return (req, res, next) => {
    // Pastikan req.user sudah ada (diset oleh authMiddleware)
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak: User belum terautentikasi',
        data: null
      });
    }

    // Cek apakah role user ada di dalam daftar roles yang diizinkan
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak: role tidak diizinkan',
        data: null
      });
    }

    // Jika sesuai, lanjutkan request
    next();
  };
};

module.exports = checkRole;
