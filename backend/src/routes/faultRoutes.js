import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listFaults, createFault, updateStatus, assignFault, categories, technicians, notifications, stats } from '../controllers/faultController.js';

const router = Router();
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', requireAuth, listFaults);
router.post('/', requireAuth, upload.single('photo'), createFault);
router.get('/categories', requireAuth, categories);
router.get('/technicians', requireAuth, requireRole('admin'), technicians);
router.get('/notifications', requireAuth, notifications);
router.get('/stats', requireAuth, requireRole('admin'), stats);
router.patch('/:id/status', requireAuth, requireRole('technician','admin'), updateStatus);
router.patch('/:id/assign', requireAuth, requireRole('admin'), assignFault);
export default router;