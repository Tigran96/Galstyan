-- Notifications (admin/moderator -> moderator/pro)
-- Run in phpMyAdmin once.

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  sender_user_id INT UNSIGNED NULL,
  -- Direct user target (optional). If set, this notification is for that specific user.
  target_user_id INT UNSIGNED NULL,
  -- Role targets (optional). CSV: 'moderator', 'pro', 'moderator,pro'
  target_roles VARCHAR(64) NOT NULL DEFAULT '',
  title VARCHAR(190) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notifications_created_at (created_at),
  KEY idx_notifications_target_roles (target_roles),
  KEY idx_notifications_target_user_id (target_user_id),
  CONSTRAINT fk_notifications_sender_user
    FOREIGN KEY (sender_user_id) REFERENCES users(id)
    ON DELETE SET NULL
  ,CONSTRAINT fk_notifications_target_user
    FOREIGN KEY (target_user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


