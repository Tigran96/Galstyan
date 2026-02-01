-- Roles migration / normalization
-- Supported roles: admin, moderator, pro, user

-- 1) Ensure users.role exists (it should already).
-- If it doesn't, uncomment:
-- ALTER TABLE users ADD COLUMN role VARCHAR(32) NOT NULL DEFAULT 'user';

-- 2) Normalize existing values to supported set (best-effort).
UPDATE users
SET role = LOWER(TRIM(role))
WHERE role IS NOT NULL;

UPDATE users
SET role = 'user'
WHERE role IS NULL OR role = '' OR role NOT IN ('admin', 'moderator', 'pro', 'user');

-- 3) (Optional) If your MySQL supports CHECK constraints reliably, you can enforce allowed values.
-- NOTE: Some shared-hosting MySQL versions ignore CHECK. Use with caution.
-- ALTER TABLE users
--   ADD CONSTRAINT chk_users_role CHECK (role IN ('admin', 'moderator', 'pro', 'user'));


