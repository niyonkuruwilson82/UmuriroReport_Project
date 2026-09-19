import pool from '../config/db.js';
import { notify } from '../utils/notify.js';

export async function categories(req,res) {
  const [rows] = await pool.execute('SELECT * FROM fault_categories ORDER BY name');
  res.json(rows);
}

export async function listFaults(req,res) {
  const { role, user_id } = req.user;
  const sql = role === 'admin'
    ? `SELECT f.*, u.full_name reporter, c.name category,
       a.technician_id, t.full_name technician
       FROM fault_reports f JOIN users u ON u.user_id=f.user_id
       LEFT JOIN fault_categories c ON c.category_id=f.category_id
       LEFT JOIN fault_assignments a ON a.fault_id=f.fault_id
       LEFT JOIN users t ON t.user_id=a.technician_id
       ORDER BY f.created_at DESC`
    : role === 'technician'
    ? `SELECT f.*, u.full_name reporter, c.name category, a.technician_id
       FROM fault_reports f JOIN users u ON u.user_id=f.user_id
       LEFT JOIN fault_categories c ON c.category_id=f.category_id
       JOIN fault_assignments a ON a.fault_id=f.fault_id
       WHERE a.technician_id=? ORDER BY f.created_at DESC`
    : `SELECT f.*, u.full_name reporter, c.name category
       FROM fault_reports f JOIN users u ON u.user_id=f.user_id
       LEFT JOIN fault_categories c ON c.category_id=f.category_id
       WHERE f.user_id=? ORDER BY f.created_at DESC`;
  const [rows] = await pool.execute(sql, role === 'user' || role === 'technician' ? [user_id] : []);
  res.json(rows);
}

export async function createFault(req,res) {
  const { title, description, category_id, latitude, longitude, address } = req.body;
  if (!title || !description) return res.status(400).json({message:'Title and description are required'});
  const photo = req.file ? `/uploads/${req.file.filename}` : null;
  const [result] = await pool.execute(
    `INSERT INTO fault_reports
     (user_id,category_id,title,description,latitude,longitude,address,photo)
     VALUES (?,?,?,?,?,?,?,?)`,
    [req.user.user_id,category_id || null,title,description,latitude || null,longitude || null,address || null,photo]
  );
  await notify(req.user.user_id, `Fault report #${result.insertId} submitted successfully.`);
  res.status(201).json({ fault_id: result.insertId, message:'Fault reported successfully' });
}

export async function updateStatus(req,res) {
  const { status, comment } = req.body;
  const allowed = ['Pending','In Progress','Resolved'];
  if (!allowed.includes(status)) return res.status(400).json({message:'Invalid status'});
  const [faultRows] = await pool.execute('SELECT * FROM fault_reports WHERE fault_id=?',[req.params.id]);
  if (!faultRows.length) return res.status(404).json({message:'Fault not found'});
  const fault = faultRows[0];
  await pool.execute('UPDATE fault_reports SET status=? WHERE fault_id=?',[status,req.params.id]);
  await pool.execute(
    'INSERT INTO fault_updates (fault_id,user_id,status,comment) VALUES (?,?,?,?)',
    [req.params.id,req.user.user_id,status,comment || null]
  );
  await notify(fault.user_id, `Fault #${req.params.id} status changed to ${status}.`);
  res.json({message:'Status updated'});
}

export async function assignFault(req,res) {
  const { technician_id, remarks } = req.body;
  const [tech] = await pool.execute("SELECT user_id,full_name FROM users WHERE user_id=? AND role='technician'",[technician_id]);
  if (!tech.length) return res.status(400).json({message:'Technician not found'});
  await pool.execute('DELETE FROM fault_assignments WHERE fault_id=?',[req.params.id]);
  await pool.execute(
    'INSERT INTO fault_assignments (fault_id,technician_id,remarks) VALUES (?,?,?)',
    [req.params.id,technician_id,remarks || null]
  );
  const [fault] = await pool.execute('SELECT user_id FROM fault_reports WHERE fault_id=?',[req.params.id]);
  await notify(fault[0].user_id, `Technician ${tech[0].full_name} was assigned to fault #${req.params.id}.`);
  await notify(technician_id, `You were assigned fault #${req.params.id}.`);
  res.json({message:'Technician assigned'});
}

export async function technicians(req,res) {
  const [rows] = await pool.execute("SELECT user_id,full_name,email,phone FROM users WHERE role='technician' ORDER BY full_name");
  res.json(rows);
}

export async function notifications(req,res) {
  const [rows] = await pool.execute('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC',[req.user.user_id]);
  res.json(rows);
}

export async function stats(req,res) {
  const [[total]] = await pool.query('SELECT COUNT(*) count FROM fault_reports');
  const [[pending]] = await pool.query("SELECT COUNT(*) count FROM fault_reports WHERE status='Pending'");
  const [[progress]] = await pool.query("SELECT COUNT(*) count FROM fault_reports WHERE status='In Progress'");
  const [[resolved]] = await pool.query("SELECT COUNT(*) count FROM fault_reports WHERE status='Resolved'");
  const [[techs]] = await pool.query("SELECT COUNT(*) count FROM users WHERE role='technician'");
  res.json({ total:total.count, pending:pending.count, inProgress:progress.count, resolved:resolved.count, technicians:techs.count });
}