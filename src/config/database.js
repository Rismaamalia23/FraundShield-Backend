const mysql = require('mysql2/promise');
require('dotenv').config();

/** Inisialisasi pool koneksi database MySQL menggunakan URL Railway atau manual fallback */
const connectionUrl = process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.MYSQL_PRIVATE_URL;

let pool;

if (connectionUrl) {
  // Pakai URL langsung dari Railway (paling reliable)
  console.log('🔌 Menggunakan DATABASE_URL untuk koneksi');
  pool = mysql.createPool(connectionUrl + '?family=4');
} else {
  // Fallback: pakai variabel individual (untuk lokal / manual config)
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const database = process.env.DB_NAME || 'fraudshield';

  console.log('🔌 DB Config (manual):', { host, port, user, database });

  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    family: 4
  });
}

// Test koneksi saat startup
pool.getConnection()
  .then(conn => {
    console.log('✅ Database connected successfully');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

module.exports = pool;
