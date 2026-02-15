-- Support chat reminders migration
-- Run in phpMyAdmin once.
--
-- Tracks whether a "15 minute no-reply" reminder was already sent for the latest user message.

ALTER TABLE support_conversations
  ADD COLUMN last_reminder_msg_id BIGINT UNSIGNED NULL AFTER last_message_at,
  ADD COLUMN last_reminder_at TIMESTAMP NULL AFTER last_reminder_msg_id;


