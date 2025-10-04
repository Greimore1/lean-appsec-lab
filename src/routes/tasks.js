const express = require('express');
const { db } = require('../db');

module.exports = function(VULN) {
  const r = express.Router();

  // Get task by id
  r.get('/:id', (req, res) => {
    const id = req.params.id;

    if (VULN) {
      // IDOR: no ownership check (demo)
      return db.get('SELECT id, owner, description FROM tasks WHERE id=?', [id], (err, row) => {
        if (!row) return res.status(404).json({ error: 'Not found' });
        return res.json(row); // reflected XSS risk in vulnerable mode
      });
    }

    // Safe path: enforce ownership + minimal encoding
    db.get('SELECT id, owner, description FROM tasks WHERE id=? AND owner=?', [id, req.user.uid], (err, row) => {
      if (!row) return res.status(404).json({ error: 'Not found' });
      const safe = { ...row, description: String(row.description).replace(/</g, '&lt;').replace(/>/g, '&gt;') };
      return res.json(safe);
    });
  });

  // Create task
  r.post('/', (req, res) => {
    const { description } = req.body;
    db.run('INSERT INTO tasks (owner, description) VALUES (?, ?)', [req.user.uid, description], function(err) {
      return res.status(201).json({ id: this.lastID });
    });
  });

  return r;
}
