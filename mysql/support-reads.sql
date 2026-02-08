-- Support chat read/unread tracking per user
-- Run in phpMyAdmin once.

CREATE TABLE IF NOT EXISTS support_reads (
  conversation_id BIGINT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  last_seen_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (conversation_id, user_id),
  KEY idx_support_reads_user_seen (user_id, last_seen_at),
  CONSTRAINT fk_support_reads_conv
    FOREIGN KEY (conversation_id) REFERENCES support_conversations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_support_reads_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


