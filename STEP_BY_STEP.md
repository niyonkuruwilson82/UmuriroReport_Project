# UMURIROREPORT – STEP-BY-STEP CODING GUIDE

## STEP 1 — Install software
Install Node.js 20+ and MySQL 8+. Open VS Code.

## STEP 2 — Open the project
Open the `UmuriroReport` folder in VS Code.

## STEP 3 — Create the database
Open MySQL Workbench or phpMyAdmin.
Run:
```sql
SOURCE backend/database/schema.sql;
```

If SOURCE is not available, open `backend/database/schema.sql`, copy everything, and run it in the SQL editor.

## STEP 4 — Configure backend
Open `backend/.env.example`.
Copy it as `.env`.
Set:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=umuriroreport
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
JWT_SECRET=YOUR_LONG_SECRET
CLIENT_URL=http://localhost:5173
```

## STEP 5 — Start backend
Terminal 1:
```bash
cd backend
npm install
npm run dev
```
Test:
http://localhost:5000/api/health

Expected:
```json
{"message":"UmuriroReport API is running"}
```

## STEP 6 — Start frontend
Terminal 2:
```bash
cd frontend
npm install
npm run dev
```
Open the URL shown by Vite, normally:
http://localhost:5173

## STEP 7 — Test registration
Click Create Account and register a citizen.

## STEP 8 — Test fault reporting
Login, click Report Fault, select category, write description, optionally upload an image, click a location on the map, then submit.

## STEP 9 — Test admin
Login:
admin@umuriro.rw
Admin@123

The admin can see all reports, dashboard statistics and assign technicians.

## STEP 10 — Test technician
Login:
tech@umuriro.rw
Tech@123

The technician can see assigned faults and change status:
Pending -> In Progress -> Resolved.

## STEP 11 — Understand the architecture

FRONTEND
React pages/components -> Axios -> REST API

BACKEND
Express routes -> Controllers -> MySQL

DATABASE
users
fault_categories
fault_reports
fault_assignments
fault_updates
notifications

## STEP 12 — Important next improvements
For production:
1. Replace demo passwords/seeds.
2. Use HTTPS.
3. Add request rate limiting.
4. Validate file MIME type and image dimensions.
5. Store uploads in cloud/object storage.
6. Add pagination and search.
7. Add email/SMS/WhatsApp notifications.
8. Add admin report export.
9. Add proper audit logs.
10. Configure a production MySQL database and backups.
