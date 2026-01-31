-- Example user insert.
-- Generate password_hash locally with:
--   node tools/make-user.cjs demo "yourPasswordHere" user
-- Then copy the "passwordHash" value into password_hash below.

INSERT INTO users (username, password_hash, role)
VALUES ('demo', '$2a$10$REPLACE_WITH_BCRYPT_HASH', 'user');


