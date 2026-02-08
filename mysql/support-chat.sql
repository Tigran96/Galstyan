-- Support chat: Pro users can start conversations with staff (admin/moderator).
-- Run in phpMyAdmin once.

CREATE TABLE IF NOT EXISTS support_conversations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  pro_user_id INT UNSIGNED NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'open', -- open|closed
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_support_conv_pro (pro_user_id, last_message_at),
  KEY idx_support_conv_last (last_message_at),
  CONSTRAINT fk_support_conv_pro_user
    FOREIGN KEY (pro_user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS support_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id BIGINT UNSIGNED NOT NULL,
  sender_user_id INT UNSIGNED NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_support_msg_conv_created (conversation_id, created_at),
  CONSTRAINT fk_support_msg_conv
    FOREIGN KEY (conversation_id) REFERENCES support_conversations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_support_msg_sender
    FOREIGN KEY (sender_user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


