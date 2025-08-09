const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');
const initDb = require('./init-db');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize DB (creates tables and a seeded doctor user)
initDb();

// Serve static client files
app.use('/', express.static(path.join(__dirname, '..', 'client')));

// API routes
app.use('/api/auth', authRouter);
app.use('/api', apiRouter);

// fallback to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
