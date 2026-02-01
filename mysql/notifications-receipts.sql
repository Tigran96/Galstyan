-- Read/unread tracking for notifications
-- Run in phpMyAdmin once.

CREATE TABLE IF NOT EXISTS notifications_receipts (
  notification_id BIGINT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  read_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (notification_id, user_id),
  KEY idx_notif_receipts_user_read (user_id, read_at),
  CONSTRAINT fk_notif_receipts_notification
    FOREIGN KEY (notification_id) REFERENCES notifications(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_notif_receipts_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


