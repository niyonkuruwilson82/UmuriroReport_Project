import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

function token(user) {
  return jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role, full_name: user.full_name },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

export async function register(req, res) {
  try {
    const { full_name, email, phone, password, address } = req.body;
    if (!full_name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    const [exists] = await pool.execute('SELECT user_id FROM users WHERE email=?', [email]);
    if (exists.length) return res.status(409).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (full_name,email,phone,password,address) VALUES (?,?,?,?,?)',
      [full_name,email,phone || null,hash,address || null]
    );
    const [rows] = await pool.execute('SELECT user_id,full_name,email,phone,role,address FROM users WHERE user_id=?',[result.insertId]);
    res.status(201).json({ user: rows[0], token: token(rows[0]) });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.execute('SELECT * FROM users WHERE email=?', [email]);
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const user = rows[0];
    delete user.password;
    res.json({ user, token: token(user) });
  } catch (e) { res.status(500).json({ message: e.message }); }
}