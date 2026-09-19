import pool from '../config/db.js';

export async function notify(userId, message) {
  await pool.execute(
    'INSERT INTO notifications (user_id, message) VALUES (?, ?)',
    [userId, message]
  );
}