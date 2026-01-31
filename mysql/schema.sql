-- MySQL schema for private users + profiles
-- Engine/charset choices are cPanel-friendly.

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL,
  email VARCHAR(190) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_users_username (username),
  UNIQUE KEY uniq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profiles (
  user_id INT UNSIGNED NOT NULL,
  first_name VARCHAR(64) NULL,
  last_name VARCHAR(64) NULL,
  age TINYINT UNSIGNED NULL,
  full_name VARCHAR(128) NULL,
  email VARCHAR(190) NULL,
  phone VARCHAR(64) NULL,
  grade VARCHAR(32) NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_profiles_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


