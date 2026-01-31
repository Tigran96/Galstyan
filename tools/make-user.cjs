// Usage:
//   node tools/make-user.cjs <username> <password> [role]
//
// Outputs a JSON object you can add to users.json (or AUTH_USERS_JSON).

const bcrypt = require('bcryptjs');

const username = process.argv[2];
const password = process.argv[3];
const role = process.argv[4] || 'user';

if (!username || !password) {
  console.error('Usage: node tools/make-user.cjs <username> <password> [role]');
  process.exit(1);
}

const passwordHash = bcrypt.hashSync(String(password), 10);
const entry = {
  username: String(username),
  passwordHash,
  role: String(role),
  createdAt: new Date().toISOString(),
};

process.stdout.write(JSON.stringify(entry, null, 2) + '\n');


