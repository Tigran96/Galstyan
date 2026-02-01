// Simple Express backend server for AI Chat
// Run with: node server.js
// Make sure to set OPENAI_API_KEY in .env file

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET;
const AUTH_TOKEN_TTL = process.env.AUTH_TOKEN_TTL || '7d';

// --- MySQL (optional) ---
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;
const DB_SSL = String(process.env.DB_SSL || '').toLowerCase() === 'true';
let dbPool = null;

// --- Email (SMTP) ---
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';
const SMTP_FROM = process.env.SMTP_FROM;
const PUBLIC_SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://www.galstyanacademy.com').replace(/\/+$/, '');

let mailTransporter = null;
function getMailer() {
  if (mailTransporter) return mailTransporter;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_FROM) return null;

  mailTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    tls: { rejectUnauthorized: false },
  });
  return mailTransporter;
}

async function sendEmail({ to, subject, text }) {
  const mailer = getMailer();
  if (!mailer) {
    const err = new Error('SMTP is not configured');
    err.code = 'SMTP_NOT_CONFIGURED';
    throw err;
  }
  await mailer.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    text,
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDbPool() {
  if (dbPool) return dbPool;
  if (!DB_HOST || !DB_USER || !DB_NAME) return null;

  dbPool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 5,
    enableKeepAlive: true,
    ssl: DB_SSL ? { rejectUnauthorized: false } : undefined,
  });

  return dbPool;
}

async function dbFindUserByLogin(login) {
  const pool = getDbPool();
  if (!pool) return null;
  const [rows] = await pool.query(
    'SELECT id, username, email, password_hash AS passwordHash, role FROM users WHERE LOWER(username)=LOWER(?) OR LOWER(email)=LOWER(?) LIMIT 1',
    [String(login), String(login)]
  );
  return rows && rows[0] ? rows[0] : null;
}

async function dbFindUserByEmail(email) {
  const pool = getDbPool();
  if (!pool) return null;
  const [rows] = await pool.query(
    `
      SELECT
        u.id,
        u.username,
        u.email,
        u.password_hash AS passwordHash,
        u.role
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      WHERE LOWER(COALESCE(u.email, p.email)) = LOWER(?)
      LIMIT 1
    `,
    [String(email)]
  );
  return rows && rows[0] ? rows[0] : null;
}

async function dbCreatePasswordReset(userId) {
  const pool = getDbPool();
  if (!pool) return null;
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await pool.query(
    'INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 60 MINUTE))',
    [userId, tokenHash]
  );
  return token;
}

async function dbConsumePasswordReset(token, newPasswordHash) {
  const pool = getDbPool();
  if (!pool) return { ok: false, reason: 'NO_DB' };
  const tokenHash = crypto.createHash('sha256').update(String(token)).digest('hex');

  const [rows] = await pool.query(
    `
      SELECT id, user_id AS userId, expires_at AS expiresAt, used_at AS usedAt
      FROM password_resets
      WHERE token_hash = ?
      LIMIT 1
    `,
    [tokenHash]
  );
  if (!rows || !rows[0]) return { ok: false, reason: 'NOT_FOUND' };
  const row = rows[0];
  if (row.usedAt) return { ok: false, reason: 'USED' };
  const expires = new Date(row.expiresAt);
  if (Number.isNaN(expires.getTime()) || expires.getTime() < Date.now()) {
    return { ok: false, reason: 'EXPIRED' };
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, row.userId]);
    await conn.query('UPDATE password_resets SET used_at = NOW() WHERE id = ?', [row.id]);
    await conn.commit();
    return { ok: true, userId: row.userId };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

async function dbEnsureProfile(userId) {
  const pool = getDbPool();
  if (!pool) return;
  await pool.query('INSERT IGNORE INTO profiles (user_id) VALUES (?)', [userId]);
}

async function dbGetProfile(userId) {
  const pool = getDbPool();
  if (!pool) return null;
  const [rows] = await pool.query(
    `
      SELECT
        u.id AS userId,
        u.username,
        u.role,
        u.email AS userEmail,
        p.first_name AS firstName,
        p.last_name AS lastName,
        p.age,
        p.full_name AS fullName,
        p.email,
        p.phone,
        p.grade,
        p.updated_at AS updatedAt
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      WHERE u.id = ?
      LIMIT 1
    `,
    [userId]
  );
  return rows && rows[0] ? rows[0] : null;
}

async function dbUpdateProfile(userId, patch) {
  const pool = getDbPool();
  if (!pool) return null;
  await dbEnsureProfile(userId);

  const firstName = patch.firstName ?? null;
  const lastName = patch.lastName ?? null;
  const age = patch.age ?? null;
  const fullName = patch.fullName ?? null;
  const email = patch.email ?? null;
  const phone = patch.phone ?? null;
  const grade = patch.grade ?? null;

  await pool.query(
    `
      UPDATE profiles
      SET first_name = ?, last_name = ?, age = ?, full_name = ?, email = ?, phone = ?, grade = ?, updated_at = NOW()
      WHERE user_id = ?
    `,
    [firstName, lastName, age, fullName, email, phone, grade, userId]
  );

  return dbGetProfile(userId);
}

function loadUsers() {
  // Option 1: provide users from env
  if (process.env.AUTH_USERS_JSON) {
    try {
      const parsed = JSON.parse(process.env.AUTH_USERS_JSON);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error('Failed to parse AUTH_USERS_JSON:', e.message);
    }
  }

  // Option 2: read from users.json in the app root
  const usersPath = path.join(__dirname, 'users.json');
  try {
    if (!fs.existsSync(usersPath)) return [];
    const raw = fs.readFileSync(usersPath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load users.json:', e.message);
    return [];
  }
}

function signToken(payload) {
  if (!AUTH_JWT_SECRET) {
    throw new Error('AUTH_JWT_SECRET is not set');
  }
  return jwt.sign(payload, AUTH_JWT_SECRET, { expiresIn: AUTH_TOKEN_TTL });
}

function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!AUTH_JWT_SECRET) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    const decoded = jwt.verify(token, AUTH_JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

function requireMysqlUserId(req, res) {
  const userId = typeof req.user?.sub === 'number' ? req.user.sub : null;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return userId;
}

function requireAdmin(req, res) {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }
  return true;
}

function requireRole(req, res, roles) {
  const role = req.user?.role;
  if (!roles.includes(role)) {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }
  return true;
}

function requireAdminOnly(req, res) {
  return requireRole(req, res, ['admin']);
}

function normalizeRole(role) {
  return String(role || '')
    .trim()
    .toLowerCase();
}

function isAllowedRole(role) {
  return ['admin', 'moderator', 'pro', 'user'].includes(role);
}

function getTopicPolicyPrompt(lang = 'en') {
  const prompts = {
    hy: [
      'Դուք Նյուտոնն եք՝ Գալստյան Ակադեմիայի AI օգնականը։',
      'ՊԱՐՏԱԴԻՐ ՍԱՀՄԱՆԱՓԱԿՈՒՄ: Պատասխանեք ՄԻԱՅՆ մաթեմատիկայի, ֆիզիկայի և ընդհանուր գիտության (օր․ քիմիա, կենսաբանություն, աստղագիտություն) հարցերին։',
      'Եթե հարցը դուրս է այս թեմաներից (օր․ քաղաքականություն, իրավաբանություն, բժշկություն, անձնական խորհուրդներ, ծրագրավորում, բիզնես, կրիպտո, և այլն), քաղաքավարի հրաժարվեք և առաջարկեք տալ գիտությանը/մաթեմատիկային/ֆիզիկային վերաբերող հարց, կամ կապ հաստատել ակադեմիայի հետ։',
      'Պատասխանեք հստակ, քայլ առ քայլ, ուսուցողական ոճով։',
    ].join('\n'),
    ru: [
      'Вы — Ньютон, AI‑ассистент Академии Галстяна.',
      'ОБЯЗАТЕЛЬНОЕ ОГРАНИЧЕНИЕ: отвечайте ТОЛЬКО на вопросы по математике, физике и общей науке (например, химия, биология, астрономия).',
      'Если вопрос вне этих тем (например, политика, право, медицина, личные советы, программирование, бизнес, крипто и т.д.), вежливо откажите и предложите задать вопрос по науке/математике/физике или связаться с академией.',
      'Отвечайте дружелюбно, ясно и пошагово в образовательном стиле.',
    ].join('\n'),
    en: [
      "You are Newton — the AI assistant for Galstyan Academy.",
      'HARD TOPIC LIMIT: Answer ONLY questions about Mathematics, Physics, and general Science (e.g., Chemistry, Biology, Astronomy).',
      'If the question is outside these topics (e.g., politics, law, medicine, personal advice, programming, business, crypto, etc.), politely refuse and suggest asking a math/physics/science question or contacting the academy.',
      'Respond in a friendly, clear, step-by-step educational manner.',
    ].join('\n'),
  };

  return prompts[lang] || prompts.en;
}

// Use built-in fetch when available (Node 18+). Only fall back to node-fetch if needed.
let fetchFn = globalThis.fetch;
if (!fetchFn) {
  const mod = await import('node-fetch');
  fetchFn = mod.default;
}

// Middleware
// Allow requests from your public site to your API subdomain (CORS).
// This also helps with CORS preflight (OPTIONS) requests for JSON POSTs.
const allowedOrigins = [
  'https://www.galstyanacademy.com',
  'https://galstyanacademy.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin(origin, cb) {
      // Allow same-origin / server-to-server / tools without Origin header
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chat API is running' });
});

// Quick DB connectivity check (safe: does not reveal passwords)
app.get('/api/db/ping', async (req, res) => {
  try {
    const pool = getDbPool();
    if (!pool) {
      return res.status(400).json({
        ok: false,
        configured: false,
        missing: {
          DB_HOST: !DB_HOST,
          DB_USER: !DB_USER,
          DB_NAME: !DB_NAME,
        },
      });
    }
    await pool.query('SELECT 1');
    return res.json({ ok: true, configured: true });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      configured: true,
      error: 'DB connection failed',
      code: e.code || null,
    });
  }
});

// Quick SMTP config check (safe: does not reveal passwords)
app.get('/api/email/ping', async (req, res) => {
  const missing = {
    SMTP_HOST: !SMTP_HOST,
    SMTP_PORT: !SMTP_PORT,
    SMTP_FROM: !SMTP_FROM,
  };
  const configured = !missing.SMTP_HOST && !missing.SMTP_PORT && !missing.SMTP_FROM;
  return res.json({ ok: configured, configured, missing });
});

app.post('/api/email/test', async (req, res) => {
  try {
    const key = process.env.EMAIL_TEST_KEY;
    if (!key) return res.status(404).json({ error: 'Not found' });
    if (req.headers['x-email-test-key'] !== key) return res.status(401).json({ error: 'Unauthorized' });

    const to = (req.body && req.body.to) || SMTP_USER || SMTP_FROM;
    if (!to) return res.status(400).json({ error: 'Missing to' });

    await sendEmail({
      to,
      subject: 'SMTP test - Galstyan Academy',
      text: `SMTP test email sent at ${new Date().toISOString()}`,
    });
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: 'SMTP send failed',
      code: e.code || null,
      message: e.message || null,
    });
  }
});

// --- Auth ---
app.post('/api/auth/login', (req, res) => {
  (async () => {
    try {
      const { username, password } = req.body || {};
      if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
      }

      // Prefer MySQL if configured; otherwise fall back to env/users.json
      const dbUser = await dbFindUserByLogin(username);
      if (dbUser) {
        const ok = bcrypt.compareSync(String(password), String(dbUser.passwordHash));
        if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

        await dbEnsureProfile(dbUser.id);
        const token = signToken({ sub: dbUser.id, username: dbUser.username, email: dbUser.email || null, role: dbUser.role || 'user' });
        return res.json({
          token,
          user: { id: dbUser.id, username: dbUser.username, email: dbUser.email || null, role: dbUser.role || 'user' },
        });
      }

      const users = loadUsers();
      const user = users.find(
        (u) => (u.username || '').toLowerCase() === String(username).toLowerCase()
      );
      if (!user || !user.passwordHash) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const ok = bcrypt.compareSync(String(password), String(user.passwordHash));
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

      const token = signToken({ sub: user.username, role: user.role || 'user' });
      return res.json({
        token,
        user: { username: user.username, role: user.role || 'user' },
      });
    } catch (e) {
      console.error('Login error:', e.message);
      return res.status(500).json({ error: 'Failed to login' });
    }
  })();
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  if (typeof req.user?.sub === 'number') {
    return res.json({
      user: { id: req.user.sub, username: req.user.username, email: req.user.email || null, role: req.user.role || 'user' },
    });
  }
  return res.json({ user: { username: req.user.sub, role: req.user.role || 'user' } });
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const pool = getDbPool();
    if (!pool) return res.status(400).json({ error: 'MySQL is not configured' });

    const { firstName, lastName, email, age, password, passwordConfirm } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailNorm = String(email).trim().toLowerCase();
    const ageNum = age === undefined || age === null || age === '' ? null : Number(age);
    if (ageNum !== null && (!Number.isFinite(ageNum) || ageNum < 5 || ageNum > 120)) {
      return res.status(400).json({ error: 'Invalid age' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (passwordConfirm !== undefined && String(passwordConfirm) !== String(password)) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE LOWER(email)=LOWER(?) LIMIT 1', [
      emailNorm,
    ]);
    if (existing && existing[0]) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    let baseUsername = emailNorm.split('@')[0].replace(/[^a-z0-9._-]/g, '');
    if (!baseUsername) baseUsername = 'user';
    baseUsername = baseUsername.slice(0, 50);
    let username = baseUsername;
    for (let i = 0; i < 5; i++) {
      const [u] = await pool.query('SELECT id FROM users WHERE username = ? LIMIT 1', [username]);
      if (!u || !u[0]) break;
      username = `${baseUsername}${Math.floor(Math.random() * 9000 + 1000)}`;
    }

    const passwordHash = bcrypt.hashSync(String(password), 10);

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, emailNorm, passwordHash, 'user']
    );
    const userId = result.insertId;

    await pool.query(
      `
        INSERT INTO profiles (user_id, first_name, last_name, age, email, full_name, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        userId,
        String(firstName).trim(),
        String(lastName).trim(),
        ageNum,
        emailNorm,
        `${String(firstName).trim()} ${String(lastName).trim()}`.trim(),
      ]
    );

    const token = signToken({ sub: userId, username, email: emailNorm, role: 'user' });

    try {
      await sendEmail({
        to: emailNorm,
        subject: 'Welcome to Galstyan Academy',
        text:
          `Hello ${String(firstName).trim()} ${String(lastName).trim()},\n\n` +
          `Your account has been created successfully.\n\n` +
          `You can sign in at: ${PUBLIC_SITE_URL}\n\n` +
          `If you did not create this account, you can ignore this email.\n`,
      });
    } catch (e) {
      console.warn('Welcome email not sent:', e.code || e.message);
    }

    return res.json({
      token,
      user: { id: userId, username, email: emailNorm, role: 'user' },
    });
  } catch (e) {
    console.error('Signup error:', e.message);
    if (String(e.code || '').includes('ER_DUP_ENTRY')) {
      return res.status(409).json({ error: 'User already exists' });
    }
    if (e.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({
        error: 'Database tables are missing',
        hint: 'Run mysql/schema.sql in phpMyAdmin for this database.',
      });
    }
    if (e.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({
        error: 'Database schema is out of date',
        hint: 'Run mysql/migrate-add-profile-fields.sql (and schema migrations) in phpMyAdmin.',
      });
    }
    if (e.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({
        error: 'Database access denied',
        hint: 'Check DB_USER/DB_PASSWORD and that the MySQL user is added to the DB with ALL PRIVILEGES.',
      });
    }
    if (e.code === 'ER_DBACCESS_DENIED_ERROR' || e.code === 'ER_TABLEACCESS_DENIED_ERROR') {
      return res.status(500).json({
        error: 'Database permission denied',
        hint: 'Add the MySQL user to the database with ALL PRIVILEGES in cPanel → MySQL Databases.',
      });
    }
    return res.status(500).json({ error: 'Failed to signup', code: e.code || null });
  }
});

app.post('/api/auth/forgot', async (req, res) => {
  try {
    const pool = getDbPool();
    if (!pool) return res.status(400).json({ error: 'MySQL is not configured' });

    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Missing email' });

    const user = await dbFindUserByEmail(String(email).trim().toLowerCase());
    if (!user) {
      if (String(process.env.ALLOW_EMAIL_ENUMERATION || '').toLowerCase() === 'true') {
        return res.json({ ok: true, exists: false });
      }
      return res.json({ ok: true });
    }

    const token = await dbCreatePasswordReset(user.id);
    const resetLink = `${PUBLIC_SITE_URL}/?reset=${encodeURIComponent(token)}`;

    await sendEmail({
      to: user.email,
      subject: 'Password reset',
      text:
        `We received a request to reset your password.\n\n` +
        `Reset link (valid for 60 minutes):\n${resetLink}\n\n` +
        `If you did not request this, ignore this email.\n`,
    });

    if (String(process.env.ALLOW_EMAIL_ENUMERATION || '').toLowerCase() === 'true') {
      return res.json({ ok: true, exists: true });
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error('Forgot password error:', e.code || e.message);
    if (e.code === 'SMTP_NOT_CONFIGURED') {
      return res.status(500).json({
        error: 'Email is not configured on server',
        hint: 'Set SMTP_HOST/SMTP_PORT/SMTP_FROM (and SMTP_USER/SMTP_PASS if needed) in cPanel env vars.',
      });
    }
    if (e.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({
        error: 'Password reset table is missing',
        hint: 'Run mysql/password-resets.sql in phpMyAdmin for this database.',
        code: e.code,
      });
    }
    if (e.code === 'EAUTH') {
      return res.status(500).json({
        error: 'SMTP authentication failed',
        hint: 'Check SMTP_USER/SMTP_PASS and ensure SMTP_PORT matches SMTP_SECURE (465=true, 587=false).',
        code: e.code,
      });
    }
    return res.status(500).json({
      error: 'Failed to send reset email',
      code: e.code || null,
      message: e.message || null,
    });
  }
});

app.post('/api/auth/reset', async (req, res) => {
  try {
    const pool = getDbPool();
    if (!pool) return res.status(400).json({ error: 'MySQL is not configured' });

    const { token, password, passwordConfirm } = req.body || {};
    if (!token || !password) return res.status(400).json({ error: 'Missing token or password' });
    if (String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (passwordConfirm !== undefined && String(passwordConfirm) !== String(password)) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const newHash = bcrypt.hashSync(String(password), 10);
    const result = await dbConsumePasswordReset(token, newHash);
    if (!result.ok) {
      const map = {
        NOT_FOUND: 'Invalid reset link',
        USED: 'Reset link already used',
        EXPIRED: 'Reset link expired',
      };
      return res.status(400).json({ error: map[result.reason] || 'Invalid reset link' });
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error('Reset password error:', e.code || e.message);
    return res.status(500).json({ error: 'Failed to reset password', code: e.code || null });
  }
});

// --- Forum ---
app.get('/api/forum/threads', async (req, res) => {
  try {
    const pool = getDbPool();
    if (!pool) return res.status(400).json({ error: 'MySQL is not configured' });

    const [rows] = await pool.query(
      `
        SELECT
          t.id,
          t.title,
          t.created_at AS createdAt,
          t.updated_at AS updatedAt,
          u.username AS authorUsername,
          COUNT(p.id) AS postCount
        FROM forum_threads t
        JOIN users u ON u.id = t.author_user_id
        LEFT JOIN forum_posts p ON p.thread_id = t.id
        GROUP BY t.id
        ORDER BY t.updated_at DESC
        LIMIT 50
      `
    );
    return res.json({ threads: rows || [] });
  } catch (e) {
    console.error('Forum list error:', e.code || e.message);
    return res.status(500).json({ error: 'Failed to load forum' });
  }
});

app.get('/api/forum/threads/:id', async (req, res) => {
  try {
    const pool = getDbPool();
    if (!pool) return res.status(400).json({ error: 'MySQL is not configured' });

    const threadId = Number(req.params.id);
    if (!Number.isFinite(threadId)) return res.status(400).json({ error: 'Invalid thread id' });

    const [trows] = await pool.query(
      `
        SELECT
          t.id,
          t.title,
          t.created_at AS createdAt,
          t.updated_at AS updatedAt,
          u.username AS authorUsername
        FROM forum_threads t
        JOIN users u ON u.id = t.author_user_id
        WHERE t.id = ?
        LIMIT 1
      `,
      [threadId]
    );
    const thread = trows && trows[0] ? trows[0] : null;
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    const [prows] = await pool.query(
      `
        SELECT
          p.id,
          p.body,
          p.created_at AS createdAt,
          u.username AS authorUsername
        FROM forum_posts p
        JOIN users u ON u.id = p.author_user_id
        WHERE p.thread_id = ?
        ORDER BY p.created_at ASC
      `,
      [threadId]
    );

    return res.json({ thread, posts: prows || [] });
  } catch (e) {
    console.error('Forum thread error:', e.code || e.message);
    return res.status(500).json({ error: 'Failed to load thread' });
  }
});

app.post('/api/forum/threads', requireAuth, async (req, res) => {
  try {
    const pool = getDbPool();
    if (!pool) return res.status(400).json({ error: 'MySQL is not configured' });

    const userId = requireMysqlUserId(req, res);
    if (!userId) return;

    const { title, body } = req.body || {};
    const titleStr = String(title || '').trim();
    const bodyStr = String(body || '').trim();
    if (!titleStr || !bodyStr) return res.status(400).json({ error: 'Missing title or body' });
    if (titleStr.length > 180) return res.status(400).json({ error: 'Title too long' });
    if (bodyStr.length > 5000) return res.status(400).json({ error: 'Body too long' });

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [tres] = await conn.query(
        'INSERT INTO forum_threads (author_user_id, title) VALUES (?, ?)',
        [userId, titleStr]
      );
      const threadId = tres.insertId;
      await conn.query(
        'INSERT INTO forum_posts (thread_id, author_user_id, body) VALUES (?, ?, ?)',
        [threadId, userId, bodyStr]
      );
      await conn.commit();
      return res.json({ ok: true, threadId });
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  } catch (e) {
    console.error('Forum create thread error:', e.code || e.message);
    return res.status(500).json({ error: 'Failed to create thread' });
  }
});

app.post('/api/forum/threads/:id/posts', requireAuth, async (req, res) => {
  try {
    const pool = getDbPool();
    if (!pool) return res.status(400).json({ error: 'MySQL is not configured' });

    const userId = requireMysqlUserId(req, res);
    if (!userId) return;

    const threadId = Number(req.params.id);
    if (!Number.isFinite(threadId)) return res.status(400).json({ error: 'Invalid thread id' });

    const { body } = req.body || {};
    const bodyStr = String(body || '').trim();
    if (!bodyStr) return res.status(400).json({ error: 'Missing body' });
    if (bodyStr.length > 5000) return res.status(400).json({ error: 'Body too long' });

    const [trows] = await pool.query('SELECT id FROM forum_threads WHERE id = ? LIMIT 1', [threadId]);
    if (!trows || !trows[0]) return res.status(404).json({ error: 'Thread not found' });

    await pool.query('INSERT INTO forum_posts (thread_id, author_user_id, body) VALUES (?, ?, ?)', [
      threadId,
      userId,
      bodyStr,
    ]);
    await pool.query('UPDATE forum_threads SET updated_at = NOW() WHERE id = ?', [threadId]);

    return res.json({ ok: true });
  } catch (e) {
    console.error('Forum reply error:', e.code || e.message);
    return res.status(500).json({ error: 'Failed to add reply' });
  }
});

app.delete('/api/forum/threads/:id', requireAuth, async (req, res) => {
  try {
    const pool = getDbPool();
    if (!pool) return res.status(400).json({ error: 'MySQL is not configured' });
    // Admin or moderator can delete threads.
    if (!requireRole(req, res, ['admin', 'moderator'])) return;

    const threadId = Number(req.params.id);
    if (!Number.isFinite(threadId)) return res.status(400).json({ error: 'Invalid thread id' });

    const [trows] = await pool.query('SELECT id FROM forum_threads WHERE id = ? LIMIT 1', [threadId]);
    if (!trows || !trows[0]) return res.status(404).json({ error: 'Thread not found' });

    await pool.query('DELETE FROM forum_threads WHERE id = ?', [threadId]);
    return res.json({ ok: true });
  } catch (e) {
    console.error('Forum delete thread error:', e.code || e.message);
    return res.status(500).json({ error: 'Failed to delete thread' });
  }
});

// --- Admin ---
app.get('/api/admin/users', requireAuth, async (req, res) => {
  try {
    const pool = getDbPool();
    if (!pool) return res.status(400).json({ error: 'MySQL is not configured' });
    if (!requireAdminOnly(req, res)) return;

    const [rows] = await pool.query(
      `
        SELECT
          u.id,
          u.username,
          u.email,
          u.role,
          u.created_at AS createdAt,
          p.first_name AS firstName,
          p.last_name AS lastName,
          p.age,
          p.full_name AS fullName,
          p.email AS profileEmail,
          p.phone,
          p.grade,
          p.updated_at AS profileUpdatedAt
        FROM users u
        LEFT JOIN profiles p ON p.user_id = u.id
        ORDER BY u.created_at DESC
        LIMIT 500
      `
    );

    return res.json({ users: rows || [] });
  } catch (e) {
    console.error('Admin users list error:', e.code || e.message);
    return res.status(500).json({ error: 'Failed to load users' });
  }
});

app.post('/api/admin/users/:id/role', requireAuth, async (req, res) => {
  try {
    const pool = getDbPool();
    if (!pool) return res.status(400).json({ error: 'MySQL is not configured' });
    if (!requireAdminOnly(req, res)) return;

    const userId = Number(req.params.id);
    if (!Number.isFinite(userId)) return res.status(400).json({ error: 'Invalid user id' });

    const role = normalizeRole(req.body?.role);
    if (!isAllowedRole(role)) {
      return res.status(400).json({ error: 'Invalid role. Use: admin, moderator, pro, user' });
    }

    // Optional safety: prevent removing your own admin role by mistake.
    if (req.user?.id === userId && role !== 'admin') {
      return res.status(400).json({ error: 'You cannot change your own role.' });
    }

    await pool.query(`UPDATE users SET role = ? WHERE id = ? LIMIT 1`, [role, userId]);

    const [rows] = await pool.query(
      `SELECT id, username, email, role, created_at AS createdAt FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );

    if (!rows?.length) return res.status(404).json({ error: 'User not found' });
    return res.json({ ok: true, user: rows[0] });
  } catch (e) {
    console.error('Admin role update error:', e.code || e.message);
    return res.status(500).json({ error: 'Failed to update role' });
  }
});

// --- Profile (MySQL) ---
app.get('/api/profile/me', requireAuth, async (req, res) => {
  try {
    const pool = getDbPool();
    if (!pool) return res.status(400).json({ error: 'MySQL is not configured' });

    const userId = typeof req.user?.sub === 'number' ? req.user.sub : null;
    if (!userId) return res.status(400).json({ error: 'Invalid token for MySQL profile' });

    await dbEnsureProfile(userId);
    const profile = await dbGetProfile(userId);
    return res.json({ profile });
  } catch (e) {
    console.error('Profile get error:', e.message);
    return res.status(500).json({ error: 'Failed to load profile' });
  }
});

app.post('/api/profile/me', requireAuth, async (req, res) => {
  try {
    const pool = getDbPool();
    if (!pool) return res.status(400).json({ error: 'MySQL is not configured' });

    const userId = typeof req.user?.sub === 'number' ? req.user.sub : null;
    if (!userId) return res.status(400).json({ error: 'Invalid token for MySQL profile' });

    const { firstName, lastName, age, fullName, email, phone, grade } = req.body || {};
    const updated = await dbUpdateProfile(userId, { firstName, lastName, age, fullName, email, phone, grade });
    return res.json({ profile: updated });
  } catch (e) {
    console.error('Profile update error:', e.message);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory, lang, systemPrompt } = req.body;
    const resolvedLang = typeof lang === 'string' ? lang : 'en';

    // Validate input
    if (!message || !systemPrompt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Prepare messages for OpenAI
    // Enforce a server-side topic policy (cannot be overridden by client input).
    const policyPrompt = getTopicPolicyPrompt(resolvedLang);
    const mergedSystemPrompt = `${policyPrompt}\n\n${systemPrompt}`;

    const messages = [
      { role: 'system', content: mergedSystemPrompt },
      ...(conversationHistory || []).map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Call OpenAI API
    const response = await fetchFn('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', response.status, errorData);
      
      // Handle specific error codes with user-friendly messages
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after') || '60';
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: `Too many requests. Please wait ${retryAfter} seconds before trying again.`,
          details: errorData.error?.message || 'You have exceeded your OpenAI API rate limit. This could be due to: 1) Too many requests too quickly, 2) No credits in your account, or 3) Free tier limits. Please check your OpenAI account at https://platform.openai.com/usage',
          retryAfter: parseInt(retryAfter),
          code: 'RATE_LIMIT_EXCEEDED'
        });
      }
      
      if (response.status === 401) {
        return res.status(401).json({
          error: 'Invalid API key',
          message: 'Your OpenAI API key is invalid or expired. Please check your .env file.',
          code: 'INVALID_API_KEY'
        });
      }
      
      if (response.status === 402) {
        return res.status(402).json({
          error: 'Insufficient credits',
          message: 'Your OpenAI account has no credits. Please add credits at https://platform.openai.com/account/billing',
          code: 'INSUFFICIENT_CREDITS'
        });
      }
      
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    return res.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Failed to process chat message',
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Chat API server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY is not set in .env file');
  }
});

