-- Add direct per-user targeting to notifications (run once if you already created notifications table)

-- 1) Add target_user_id (safe if it doesn't exist yet)
ALTER TABLE notifications
  ADD COLUMN target_user_id INT UNSIGNED NULL AFTER sender_user_id;

-- 2) Ensure target_roles can be empty for direct messages
ALTER TABLE notifications
  MODIFY COLUMN target_roles VARCHAR(64) NOT NULL DEFAULT '';

-- 3) Add index + foreign key
ALTER TABLE notifications
  ADD KEY idx_notifications_target_user_id (target_user_id),
  ADD CONSTRAINT fk_notifications_target_user
    FOREIGN KEY (target_user_id) REFERENCES users(id)
    ON DELETE CASCADE;


