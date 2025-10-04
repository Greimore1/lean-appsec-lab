const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

function init() {
  db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
    db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY, owner INTEGER, description TEXT)");
    db.run("INSERT INTO users (username, password) VALUES ('alice', 'password123'), ('bob', 'hunter2')");
    db.run("INSERT INTO tasks (owner, description) VALUES (1, 'Buy milk'), (1, '<script>alert(1)</script>'), (2, 'Call mum')");
  });
}

module.exports = { db, init };
