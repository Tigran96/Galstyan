-- Simple forum schema (threads + posts)

CREATE TABLE IF NOT EXISTS forum_threads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  author_user_id INT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_forum_threads_created_at (created_at),
  CONSTRAINT fk_forum_threads_author FOREIGN KEY (author_user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS forum_posts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  thread_id BIGINT UNSIGNED NOT NULL,
  author_user_id INT UNSIGNED NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_forum_posts_thread_created (thread_id, created_at),
  CONSTRAINT fk_forum_posts_thread FOREIGN KEY (thread_id)
    REFERENCES forum_threads(id) ON DELETE CASCADE,
  CONSTRAINT fk_forum_posts_author FOREIGN KEY (author_user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


