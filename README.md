





# 📦 Purchase Order Web Application

## 📖 Project Overview
This is a **full-stack web application** for managing **purchase orders** with the following key features:
- **Login System** with role-based access (Admin/User).
- **Fixed Sidebar Navigation** for easy access to pages.
- **Admin Panel** to add or delete users.
- **Purchase Order Management**:
  - Users can enter details such as **Date, Order Number, Customer, Broker, Mill, Weight, Bags, Product, Rate, Terms & Conditions**.
  - Orders are **saved to a central database**.
  - Orders can be **edited anytime**.
  - Orders can be **exported as A4-size PDF bills**.
- **Company Profile Management**:
  - Upload company logo.
  - Add company name, address, mobile number, email, GST number, and bank details.
  - These details will appear at the **top of the generated PDF bill**.

The app will be **responsive** and accessible on any device (desktop, tablet, mobile).

## Implementation Status
🎉 **This project has been implemented!** The tech stack used is:
- **Frontend**: React.js + TailwindCSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (NeonDB)
- **Authentication**: JWT-based login system
- **PDF Generation**: jsPDF + jspdf-autotable

## 🚀 Production Deployment
For full production deployment instructions, see:
- [PRODUCTION.md](PRODUCTION.md) - Production build instructions
- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment options including Docker

### Quick Deployment
Use the provided deployment scripts:
- On Linux/MacOS: `./deploy.sh`
- On Windows: `.\deploy.ps1`

### System Health Checks
- Environment Check: `node backend/check-environment.js`
- Backend Health Check: `node backend/backend-health-check.js`
- Database Backup: `node backend/backup-db.js`

### Default Login
- Admin User:
  - Email: admin@example.com
  - Password: Admin@123

---

## ⚙️ Features Breakdown

### 🔐 Authentication
- **User Login System**.
- **Admin Role**:
  - Add new users.
  - Delete existing users.
- **User Role**:
  - Create and manage purchase orders.

### 🧭 Navigation
- Fixed sidebar for:
  - Dashboard
  - Users (Admin only)
  - Purchase Orders
  - Reports / Downloads
  - Company Profile Settings

### 📝 Purchase Orders
- Input fields:
  - Date  
  - Order Number  
  - Customer  
  - Broker  
  - Mill  
  - Weight  
  - Bags  
  - Product  
  - Rate  
  - Terms & Conditions  
- Save purchase order in database.
- Edit existing purchase orders.
- Download purchase order as **PDF (A4 size)**.

### 🏢 Company Profile
- Upload and save:
  - Logo  
  - Company Name  
  - Address  
  - Mobile Number  
  - Email  
  - GST Number  
  - Bank Details  
- Auto-display these details as a **header on generated PDFs**.

---

## 🛠️ Tech Stack Suggestion
- **Frontend**: React.js (with TailwindCSS / Bootstrap for UI)
- **Backend**: Node.js + Express.js OR Django (Python)
- **Authentication**: Firebase Auth or JWT-based system
- **Database**: Firebase Firestore / PostgreSQL / MySQL
- **PDF Generation**: jsPDF / Puppeteer (Node) or ReportLab (Python)
- **Deployment**:  
  - Frontend → Vercel / Netlify  
  - Backend → Render / Railway / Firebase Functions  
  - Database → Firebase / Supabase / PostgreSQL Cloud  

---

## 📂 Project Structure (Example)

purchase-order-app/
│── frontend/ # React.js frontend with sidebar + forms
│ ├── src/components/
│ ├── src/pages/
│ ├── src/utils/
│ └── ...
│
│── backend/ # Node.js/Express.js or Django API
│ ├── routes/
│ ├── models/
│ ├── controllers/
│ └── ...
│
│── database/ # DB schema, migrations, config
│
│── README.md # Project instructions

---

## 🚀 Core Flow
1. **User logs in** → Auth system verifies credentials.
2. **Dashboard loads** with sidebar navigation.
3. **Admin** can add/delete users.
4. **User** opens Purchase Order form, enters details, and clicks **Save**.
5. Data is stored in **database**.
6. User can **edit existing purchase orders**.
7. User can **download purchase order as PDF** with **company details header**.
8. **Company profile page** allows uploading/updating logo & details → auto-updated on future PDFs.

---

## 📅 Development Roadmap (Suggested)
- **Week 1–2**: Setup project, implement login/authentication.
- **Week 3**: Create sidebar navigation + role-based access.
- **Week 4**: Build purchase order form + database integration.
- **Week 5**: Implement edit + PDF generation.
- **Week 6**: Add company profile module (logo/details).
- **Week 7**: Testing, bug fixes, responsive design.
- **Week 8**: Deployment to production.

---

## ✅ Future Enhancements
- Search & filter purchase orders.
- Email PDF bill directly to customer.
- Multi-language support.
- Analytics Dashboard (total orders, revenue, etc.).

---

## � Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure PostgreSQL:
   - Create a database named `po_system`
   - Update the `.env` file with your PostgreSQL credentials

4. Initialize the database:
   ```
   node init-db.js
   ```

5. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

### Default Login Credentials
- **Username**: admin
- **Password**: admin123

---

## �📌 Author
Project idea and requirements by **Krishna** 👨‍💻  
