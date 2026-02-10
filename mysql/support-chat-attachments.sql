-- Support chat attachments migration
-- Run in phpMyAdmin once (after mysql/support-chat.sql).
--
-- Adds optional attachment fields to support_messages.
--
-- Note: If your MySQL version doesn't support IF NOT EXISTS for columns,
-- run the ALTER statements one by one and skip ones that already exist.

ALTER TABLE support_messages
  ADD COLUMN attachment_path VARCHAR(500) NULL AFTER body,
  ADD COLUMN attachment_mime VARCHAR(100) NULL AFTER attachment_path,
  ADD COLUMN attachment_name VARCHAR(255) NULL AFTER attachment_mime,
  ADD COLUMN attachment_size INT UNSIGNED NULL AFTER attachment_name;


