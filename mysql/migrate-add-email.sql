-- Run this ONE TIME if you already created tables without the users.email column.

ALTER TABLE users
  ADD COLUMN email VARCHAR(190) NULL AFTER username;

ALTER TABLE users
  ADD UNIQUE KEY uniq_users_email (email);


