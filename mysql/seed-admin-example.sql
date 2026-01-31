-- Create an admin user.
-- Recommended: generate SQL automatically:
--   node tools/make-user-sql.cjs admin your@email.com "yourPasswordHere" admin
--
-- Or manually replace placeholders below:

INSERT INTO users (username, email, password_hash, role)
VALUES ('admin', 'YOUR_EMAIL_HERE', '$2a$10$REPLACE_WITH_BCRYPT_HASH', 'admin');


