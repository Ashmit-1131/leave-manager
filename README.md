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

Open http://localhost:3000 (frontend) and backend runs on http://localhost:8082

## Features
- Register/login for Employee & Admin (JWT)
- Employee: apply leave, view balance & history
- Manager/Admin: approve/reject, adjust balances
- Emails via Nodemailer with Approve/Reject links
- Cron-based auto-escalation after 24 hours

1. For Employees

Register / Login
![alt text](image-9.png)

If you are a new user, click Register and create an account.

![alt text](image-10.png)

If already registered, use Login.

Dashboard
![alt text](image-11.png)

After login, you will see your leave balance (Casual & Privilege leaves).

Apply for Leave
![alt text](image-12.png)

Go to Apply Leave section.

Select leave type (Casual or Privilege).

Pick the start & end dates.

Enter a reason.

Submit.

✅ Your leave request should now appear under My Leaves with status = Pending.

Check Leave Status

In My Leaves page, you can see:

Date range

Type of leave

Status → Pending / Approved / Rejected

2. For Admin (HR)

Login as Admin (email: beingashmit@gmail.com,password: 12345)

Use the admin credentials provided.

If logged in as Admin, you will see Admin Dashboard.

Admin Dashboard
![alt text](image-13.png)
Shows:

Total Employees

Pending Leave Requests count

Button → Review Requests

Below, you can also see Employee Details Table with leave balances.

Review Leave Requests

Click Review Requests.
![alt text](image-14.png)
You will see a table of pending requests.

For each request:

 Click Approve (Green) to approve.

Click Reject (Red) to reject.

After decision, status will update for the employee.

Adjust Employee Leave Balance

In Employee Details Table, you can manually adjust leave balances.

Use +1 (green button) to increase.

Use -1 (red button) to decrease.

The new balance will update immediately.

Create New Admin (Optional Feature)

In the Admin Employees section, there is a form to create another admin account.

click on create User button
![alt text](image-15.png)

Fill in details → Click Create (only admin can create new admin).
![alt text](image-16.png)
The new admin will now be able to log in.

3. Email Notifications (if SMTP enabled)

When admin approves/rejects leave, the employee will get an email notification.

Email may also contain links that redirect to the website.

4. Test Workflow Example

Login as Employee → Apply for leave.

Login as Admin → Go to Review Requests → Approve the leave.

Login back as Employee → See that the leave is now Approved.

Admin adjusts leave balance → Employee sees updated balance in dashboard.




to setUp this project locally clone the repository and follow these steps

# Quick start (local)

### Backend
cd backend
 .env   # set values
 copy paste this in backend .env
 {
    PORT=8082
MONGO_URI=mongodb+srv://ashmit:ashmit@cluster0.dndgoyg.mongodb.net/leave-management?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=jwtsecretekey
JWT_EXPIRES_IN=1d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=beingashmit@gmail.com
SMTP_PASS=pbhn pqfx fhug wjfd

FROM_EMAIL="Leave System <beingashmit@gmail.com>"
# public URLs (frontend/backend)
# Public URLs
BACKEND_URL=http://localhost:8082    
FRONTEND_URL=http://localhost:3000

# Token secret for email actions
ACTION_JWT_SECRET=abcedehfkdjdahajdalleijicsxse
ACTION_JWT_EXPIRES=24h


 }
npm install
npm start

### Frontend
cd frontend
open the src folder in api/apiClient.js file 
replace backend url with this:- http://localhost:8082/api
npm install
npm start

Open http://localhost:3000 (frontend) and backend runs on http://localhost:8082
