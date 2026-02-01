# Private pages (Login) setup

This project supports a simple login system for **private pages** using:
- **JWT tokens** (stored in browser localStorage)
- Backend endpoints: `POST /api/auth/login`, `GET /api/auth/me`

## Backend (cPanel API app)

### 1) Install new dependencies
In your Node.js app root (example: `/home/.../nodeapps/galstyan-chat`):

```bash
npm install
```

### 2) Add environment variables (cPanel → Setup Node.js App → Environment Variables)

- `AUTH_JWT_SECRET` = a long random secret (keep private)
- `AUTH_TOKEN_TTL` = optional, default `7d`

### 3) Choose where users/profiles are stored

#### Option A (recommended): MySQL (real profiles)
Set DB env vars:
- `DB_HOST` (usually `localhost`)
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT` (optional)
- `DB_SSL` (optional, `true`/`false`)

Then create tables by running `mysql/schema.sql` inside **phpMyAdmin** (cPanel).

Create your first user by inserting `mysql/seed-example.sql` (replace the bcrypt hash).

### Email (SMTP) for welcome + password reset
Set these env vars in **cPanel → Setup Node.js App → Environment Variables**:
- `PUBLIC_SITE_URL` = `https://www.galstyanacademy.com`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE` (`true` for 465, `false` for 587)
- `SMTP_FROM` (example: `no-reply@galstyanacademy.com`)
- `SMTP_USER` (optional if your SMTP requires auth)
- `SMTP_PASS` (optional if your SMTP requires auth)

Then, in phpMyAdmin run:
- `mysql/password-resets.sql` (creates `password_resets` table)

## Forum (optional)
To enable the forum feature, run in phpMyAdmin:
- `mysql/forum.sql`

## Notifications (admin/moderator -> moderator/pro)
To enable notifications, run in phpMyAdmin:
- `mysql/notifications.sql`
- `mysql/notifications-receipts.sql`

Rules:
- Only **admin** and **moderator** can send notifications.
- Notifications can be sent to **moderator**, **pro**, or **moderator+pro** audiences.
- Read/unread is tracked per user in `notifications_receipts`.

## Roles (admin / moderator / pro / user)
Your users are stored in MySQL table: `users`

- Column: `users.role`
- Allowed values: `admin`, `moderator`, `pro`, `user`

To normalize roles (recommended), run in phpMyAdmin:
- `mysql/roles-migration.sql`

To change a user role manually (example: make `admin`):

```sql
UPDATE users SET role='admin' WHERE email='your@email.com' LIMIT 1;
```

Current permissions:
- `admin`: full access (including deleting forum threads)
- `moderator`: can delete forum threads
- `pro`: (reserved for future premium features)
- `user`: normal user

#### Option B (legacy): JSON users list (no real profiles)
Choose **one** users source:

#### Option A (recommended on cPanel): `AUTH_USERS_JSON`
Set:
- `AUTH_USERS_JSON` = JSON array of users:

Example:

```json
[
  {
    "username": "demo",
    "passwordHash": "$2a$10$....bcrypt-hash....",
    "role": "user"
  }
]
```

To generate a bcrypt hash locally:

```bash
node tools/make-user.cjs demo "yourPasswordHere" user
```

Copy the `passwordHash` into `AUTH_USERS_JSON`.

#### Option B: upload `users.json`
Upload a `users.json` file to the **same folder as** `server.cjs` (your Node app root).
Use `users.example.json` as a template.

### 4) Restart the Node app
In cPanel, press **Restart** for your Node.js application.

## Frontend (site)

After deploying the updated frontend build, your header will show:
- **Login** (when logged out)
- **Dashboard + Logout** (when logged in)

The dashboard is a private page (requires login).


