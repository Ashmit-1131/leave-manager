Create leave:
User --> Frontend --> POST /leaves --> Backend validates -> DB
                                Backend -> Notify manager (email)
Manager --> Approve --> PATCH /leaves/:id/approve -> Backend updates DB -> notify user







# Employee Leave Management System

Full-stack app with Node.js/Express + MongoDB backend and React + Redux frontend.

## Quick start (local)

### Backend
cd backend
cp .env.example .env   # set values
npm install
npm run dev

### Frontend
cd frontend
cp .env.example .env
npm install
npm start

Open http://localhost:3000 (frontend) and backend runs on http://localhost:5000

## Features
- Register/login for Employee & Admin (JWT)
- Employee: apply leave, view balance & history
- Manager/Admin: approve/reject, adjust balances
- Emails via Nodemailer with Approve/Reject links
- Cron-based auto-escalation after 24 hours

