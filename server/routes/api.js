const express = require('express');
const router = express.Router();
const dbModule = require('../db');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// list services
router.get('/services', (req, res) => {
  dbModule.getDbConnection((err, db) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    db.all('SELECT * FROM services ORDER BY id', [], (err, rows) => {
      res.json({ services: rows });
    });
  });
});

// create appointment (public)
router.post('/appointments', (req, res) => {
  const { name, email, phone, date, time, service_id } = req.body;
  if (!date || !time || !service_id) return res.status(400).json({ error: 'Missing fields' });
  dbModule.getDbConnection((err, db) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    // check double booking
    db.get('SELECT id FROM appointments WHERE date = ? AND time = ? AND status IN ("pending","confirmed")', [date, time], (err, row) => {
      if (row) return res.status(400).json({ error: 'Slot not available' });
      db.run('INSERT INTO appointments (user_id,name,email,phone,date,time,service_id,status) VALUES (?,?,?,?,?,?,?,?)',
        [null, name, email, phone, date, time, service_id, 'pending'], function(err) {
          if (err) return res.status(500).json({ error: 'Insert failed' });
          const id = this.lastID;
          // send simple email if SMTP configured
          if (process.env.SMTP_HOST) {
            const transporter = nodemailer.createTransport({
              host: process.env.SMTP_HOST,
              port: parseInt(process.env.SMTP_PORT || '587',10),
              secure: false,
              auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            });
            transporter.sendMail({ from: process.env.SMTP_USER, to: email, subject: 'Appointment received', text: `Your appointment request (${date} ${time}) received.` }).catch(e=>console.warn('mail',e.message));
          }
          res.json({ status: 'ok', appointmentId: id });
      });
    });
  });
});

// patient appointments (requires auth)
router.get('/appointments', auth(), (req, res) => {
  const userId = req.user.id;
  dbModule.getDbConnection((err, db) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (req.user.role === 'doctor') {
      db.all('SELECT a.*, s.title as service FROM appointments a LEFT JOIN services s ON s.id=a.service_id ORDER BY date,time', [], (err, rows) => {
        return res.json({ appointments: rows });
      });
    } else {
      db.all('SELECT a.*, s.title as service FROM appointments a LEFT JOIN services s ON s.id=a.service_id WHERE a.user_id = ? OR a.email = ? ORDER BY date,time', [userId, req.user.email], (err, rows) => {
        res.json({ appointments: rows });
      });
    }
  });
});

// admin approve (doctor only)
router.put('/appointments/:id/approve', auth('doctor'), (req, res) => {
  const id = req.params.id;
  dbModule.getDbConnection((err, db) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    db.run('UPDATE appointments SET status = ? WHERE id = ?', ['confirmed', id], function(err) {
      if (err) return res.status(500).json({ error: 'Update failed' });
      res.json({ status: 'ok' });
    });
  });
});

module.exports = router;
