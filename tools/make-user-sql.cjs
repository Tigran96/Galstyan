// Usage:
//   node tools/make-user-sql.cjs <username> <email> <password> [role]
//
// Prints a ready-to-paste SQL statement for phpMyAdmin.

const bcrypt = require('bcryptjs');

const username = process.argv[2];
const email = process.argv[3];
const password = process.argv[4];
const role = process.argv[5] || 'user';

if (!username || !email || !password) {
  console.error('Usage: node tools/make-user-sql.cjs <username> <email> <password> [role]');
  process.exit(1);
}

const passwordHash = bcrypt.hashSync(String(password), 10);

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "''");

const sql = `INSERT INTO users (username, email, password_hash, role)
VALUES ('${esc(username)}', '${esc(email)}', '${esc(passwordHash)}', '${esc(role)}');`;

process.stdout.write(sql + '\n');


