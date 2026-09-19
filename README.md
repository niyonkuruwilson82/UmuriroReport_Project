# UmuriroReport – Electricity Fault Reporting System

A full-stack MVP based on the supplied SRS:
- React frontend
- Node.js + Express backend
- MySQL database
- JWT authentication
- Role-based access: user, technician, admin
- Fault reporting with photo upload
- Status workflow: Pending -> In Progress -> Resolved
- Technician assignment
- Notifications
- Leaflet/OpenStreetMap map support

## 1. Requirements
Install:
- Node.js 20+
- MySQL 8+
- VS Code

## 2. Database
Create a MySQL database, then run:

```sql
SOURCE backend/database/schema.sql;
```

Or copy/paste the SQL from that file into MySQL Workbench/phpMyAdmin.

## 3. Backend
```bash
cd backend
npm install
copy .env.example .env
# edit .env with your MySQL credentials
npm run dev
```

Backend: http://localhost:5000

## 4. Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## 5. Demo accounts
The database seed creates:
- Admin: admin@umuriro.rw / Admin@123
- Technician: tech@umuriro.rw / Tech@123

A normal citizen can register from the frontend.

## 6. Main folders
frontend/
  src/components
  src/pages
  src/services
  src/context

backend/
  src/controllers
  src/routes
  src/middleware
  src/config
  src/utils
  uploads/
  database/

## 7. API
POST /api/auth/register
POST /api/auth/login
GET  /api/faults
POST /api/faults
GET  /api/faults/:id
PATCH /api/faults/:id/status
PATCH /api/faults/:id/assign
GET /api/users/technicians
GET /api/notifications
GET /api/dashboard/stats

This is an MVP foundation. Production deployment should additionally use HTTPS, stronger secrets, rate limiting, secure file validation/storage, backups and a production database.
