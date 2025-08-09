const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbModule = require('../db');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// signup
router.post('/signup', (req, res) => {
  const { full_name, email, phone, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  dbModule.getDbConnection((err, db) => {
    if (err) return res.status(500).json({ error: 'DB connection failed' });
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (row) return res.status(400).json({ error: 'Email exists' });
      const hash = await bcrypt.hash(password, 10);
      db.run('INSERT INTO users (full_name,email,phone,password_hash,role,email_verified) VALUES (?,?,?,?,?,?)',
        [full_name || '', email, phone || '', hash, 'patient', 1], function(err) {
          if (err) return res.status(500).json({ error: 'Insert failed' });
          const token = jwt.sign({ id: this.lastID, role: 'patient' }, JWT_SECRET, { expiresIn: '7d' });
          res.json({ status: 'ok', token });
      });
    });
  });
});

// login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  dbModule.getDbConnection((err, db) => {
    if (err) return res.status(500).json({ error: 'DB connection failed' });
    db.get('SELECT id,password_hash,role,full_name,email FROM users WHERE email = ?', [email], async (err, row) => {
      if (!row) return res.status(400).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, row.password_hash);
      if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: row.id, role: row.role, name: row.full_name, email: row.email }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ status: 'ok', token });
    });
  });
});

module.exports = router;
