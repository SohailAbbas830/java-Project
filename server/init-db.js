const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'database.sqlite3');

module.exports = function init() {
  const exists = fs.existsSync(DB_PATH);
  const db = new sqlite3.Database(DB_PATH);
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT,
      email TEXT UNIQUE,
      phone TEXT,
      password_hash TEXT,
      role TEXT DEFAULT 'patient',
      email_verified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      duration_minutes INTEGER DEFAULT 30
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT,
      email TEXT,
      phone TEXT,
      date TEXT,
      time TEXT,
      service_id INTEGER,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.get('SELECT COUNT(*) as c FROM services', (err, row) => {
      if (!row || row.c === 0) {
        const services = [
          ['Consultation','General consultation for adults and children.',30],
          ['Follow-up','Short follow-up visit to review progress.',15],
          ['Physical Exam','Comprehensive physical examination.',45]
        ];
        const stmt = db.prepare('INSERT INTO services (title,description,duration_minutes) VALUES (?,?,?)');
        services.forEach(s => stmt.run(s[0], s[1], s[2]));
        stmt.finalize();
      }
    });

    db.get('SELECT COUNT(*) as c FROM users', async (err, row) => {
      if (!row || row.c === 0) {
        const hash = await bcrypt.hash('password', 10);
        db.run('INSERT INTO users (full_name,email,phone,password_hash,role,email_verified) VALUES (?,?,?,?,?,?)',
          ['Dr. Ayesha Khan','doctor@example.com','', hash, 'doctor',1]);
        console.log('Seeded doctor user (doctor@example.com / password)');
      }
    });
  });
  db.close();
};
