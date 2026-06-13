const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./backend/database/Bancodedados.db");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`);

db.close();

console.log("Banco criado com sucesso!");