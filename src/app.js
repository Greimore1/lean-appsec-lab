const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { db, init } = require('./db');

const app = express();
app.use(bodyParser.json());
init();

const VULN = process.env.VULN_MODE === 'on';
const JWT_SECRET = VULN ? 'secret' : process.env.JWT_SECRET || 'change_me_use_env_secret';

function sign(uid, username) {
  return jwt.sign({ uid, u: username }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '30m' });
}

// Login — safe by default, vulnerable if VULN_MODE=on
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (VULN) {
    // Vulnerable: SQL via string concatenation (demo only)
    const sql = `SELECT id, username FROM users WHERE username='${username}' AND password='${password}'`;
    return db.get(sql, [], (err, row) => {
      if (row) return res.json({ token: sign(row.id, row.username) });
      return res.status(401).json({ error: 'Invalid credentials' });
    });
  }

  // Safe: parameterised
  const sql = 'SELECT id, username FROM users WHERE username=? AND password=?';
  db.get(sql, [username, password], (err, row) => {
    if (row) return res.json({ token: sign(row.id, row.username) });
    return res.status(401).json({ error: 'Invalid credentials' });
  });
});

// Auth middleware
function auth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  try { req.user = jwt.verify(token, JWT_SECRET); } catch { return res.status(401).json({ error: 'Unauthorised' }); }
  next();
}

app.use('/tasks', auth, require('./routes/tasks')(VULN));
app.get('/healthz', (req, res) => res.json({ ok: true }));

const port = 3000;
app.listen(port, () => console.log(`App on :${port} VULN_MODE=${VULN ? 'on' : 'off'}`));
