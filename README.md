# 💰 Expense Manager

A modern, full-stack Expense Management System built with the MERN Stack that helps users efficiently track income, expenses, and financial insights. The application provides secure authentication, real-time financial analytics, transaction history, Excel export, and a responsive user interface.

## 🌐 Live Demo

🚀 **Try the live application here:**

**Live Website:** https://expense-manager-frontend-9wjd.onrender.com/

> **Note:** The application is hosted on Render's free tier. If the application has been idle, the first request may take 30–60 seconds while the backend wakes up.

---

## 🔗 Links

- **🌍 Live Demo:** https://expense-manager-frontend-9wjd.onrender.com/
- **💻 Source Code:** https://github.com/Abhishek526-star/Expense-Manager

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Render](https://img.shields.io/badge/Backend-Render-blueviolet)
![Vite](https://img.shields.io/badge/Vite-Frontend-purple?logo=vite)

---

## 📌 Features

### 🔐 Authentication
- User Registration
- Secure Login
- JWT Authentication
- Password Encryption using bcrypt
- Protected Routes

### 💸 Income Management
- Add Income
- Edit Income
- Delete Income
- View Complete Income History

### 💳 Expense Management
- Add Expense
- Edit Expense
- Delete Expense
- View Complete Expense History

### 📊 Financial Dashboard
- Total Balance
- Total Income
- Total Expense
- Monthly Overview
- Last 30 Days Analytics
- Financial Summary Cards

### 📈 Analytics
- Expense Overview
- Income Overview
- Recent Transactions
- Monthly Financial Insights

### 📤 Export
- Download Income Report (Excel)
- Download Expense Report (Excel)

### 📩 Contact Form
- Feedback Form
- Email Notification using Nodemailer

### 🎨 UI Features
- Responsive Design
- Beautiful Dashboard
- Toast Notifications
- Loading States
- Modern Card Layout
- Mobile Friendly

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- React Toastify
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer
- Multer
- XLSX

---

# 📂 Project Structure

```
Expense-Manager
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/Abhishek526-star/Expense-Manager.git

cd Expense-Manager
```

---

# Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file.

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run Backend

```bash
npm run server
```

or

```bash
npm start
```

---

# Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env` file

```
VITE_API_URL=http://localhost:4000/api
```

Run Frontend

```bash
npm run dev
```

---

# 🌐 Environment Variables

## Backend (.env)

```
EMAIL_USER=
EMAIL_PASS=
MONGODB_URI=
JWT_SECRET=
```

## Frontend (.env)

```
VITE_API_URL=
```

---

# 📦 API Endpoints

## Authentication

```
POST /api/user/register

POST /api/user/login

GET /api/user/profile
```

---

## Income

```
POST /api/income/add

GET /api/income/get

PUT /api/income/update/:id

DELETE /api/income/delete/:id

GET /api/income/downloadexcel

GET /api/income/overview
```

---

## Expense

```
POST /api/expense/add

GET /api/expense/get

PUT /api/expense/update/:id

DELETE /api/expense/delete/:id

GET /api/expense/downloadexcel

GET /api/expense/overview
```

---

## Contact

```
POST /api/contact
```

---

# 📸 Screenshots

Add screenshots here.

Example

```
screenshots/

Login.png

Dashboard.png

Income.png

Expense.png

Analytics.png

Contact.png
```

---

# 🔒 Security

- JWT Authentication
- Password Hashing using bcrypt
- Environment Variables
- Protected Routes
- Secure API Calls

---

# 📈 Future Improvements

- Dark Mode
- Monthly Budget Planner
- Recurring Transactions
- Multi-Currency Support
- Charts & Graphs
- Email Verification
- Forgot Password
- Profile Management
- AI Expense Insights
- Mobile Application

---

# 🚀 Deployment

Frontend

- Render / Vercel

Backend

- Render

Database

- MongoDB Atlas

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository.

2. Create a feature branch.

```
git checkout -b feature-name
```

3. Commit your changes.

```
git commit -m "Added new feature"
```

4. Push to your branch.

```
git push origin feature-name
```

5. Open a Pull Request.

---

# 👨‍💻 Author

**Abhishek Kumar**

B.Tech Computer Science Engineering

GitHub

https://github.com/Abhishek526-star

---

# ⭐ Support

If you like this project, don't forget to ⭐ the repository.

It motivates me to build more useful open-source projects.

---

# 📄 License

This project is licensed under the MIT License.
