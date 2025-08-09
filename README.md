Doctor Website — Full Starter (Frontend + Node.js + SQLite backend)

What's included
- client/: All HTML pages, CSS and client-side JS
- server/: Express backend with SQLite (no external DB needed)
  - Auth (signup/login) using bcrypt + JWT
  - Appointment endpoints (create, list, approve)
  - Simple admin protection via role
- package.json + .env.example + README

Setup (local)
1. Install Node.js (v18+ recommended).
2. Extract the zip and run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and set a JWT_SECRET.
4. Start the server: `npm start` or `npm run dev` (requires nodemon).
5. Open http://localhost:4000 in your browser.

Notes
- This is a starter template. For production, secure secrets, use HTTPS, and configure SMTP for email.
- Data is stored in a local SQLite file `server/database.sqlite3` created automatically.
