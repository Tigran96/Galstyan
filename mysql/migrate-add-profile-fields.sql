-- Run this ONE TIME if you already created profiles table earlier.
-- Adds first_name, last_name, age columns.

ALTER TABLE profiles
  ADD COLUMN first_name VARCHAR(64) NULL AFTER user_id,
  ADD COLUMN last_name VARCHAR(64) NULL AFTER first_name,
  ADD COLUMN age TINYINT UNSIGNED NULL AFTER last_name;


