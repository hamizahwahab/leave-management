# Leave Management System

A full-stack leave management application built with Laravel 11 and React 18. Features role-based access control (Admin, Manager, Employee), visual leave calendars, approval workflows, and leave balance tracking.

## Tech Stack

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)

## Features

- **Role-based access control** — Admin, Manager, and Employee roles with granular permissions (Sanctum token auth)
- **Leave application** — Apply for leave with type selection, date range, reason, and optional attachment
- **Visual calendar** — Browse available dates and submitted leaves in an interactive calendar view
- **Leave approval workflow** — Managers can review, approve, or reject pending requests with remarks
- **Leave balances** — Track remaining days per leave type with visual progress bars
- **Leave history** — Filter, search, and paginate through past leave requests
- **Public holidays** — View all public holidays in a four-column month-grid calendar
- **Employee management** — CRUD operations for users (Admin only)
- **Adjust balances** — Admin can manually adjust leave balances with an audit trail
- **Dashboard** — Quick overview with stats (balance, pending, approved, used days) and upcoming holidays

## Screenshots

| Page | Preview |
|------|---------|
| Dashboard | ![Dashboard](screenshots/dashboard.png) |
| Apply Leave | ![Apply Leave](screenshots/apply-leave.png) |
| Leave History | ![Leave History](screenshots/leave-history.png) |
| Leave Approval | ![Leave Approval](screenshots/leave-approval.png) |
| My Balances | ![My Balances](screenshots/my-balances.png) |
| Public Holidays | ![Public Holidays](screenshots/holidays.png) |
| Login | ![Login](screenshots/login.png) |

## Prerequisites

- PHP 8.2 or higher
- Node.js 18 or higher
- Composer
- MySQL 8.0 or higher

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/leave-management.git
   cd leave-management
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Open `.env` and update the database connection:

   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=leave_management
   DB_USERNAME=root
   DB_PASSWORD=
   ```

3. **Install backend dependencies**

   ```bash
   composer install
   ```

4. **Generate application key**

   ```bash
   php artisan key:generate
   ```

5. **Run migrations and seeders**

   ```bash
   php artisan migrate --seed
   ```

   This creates the database tables and populates them with sample data including roles, permissions, leave types, public holidays, and default users.

6. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   cd ..
   ```

7. **Start the development servers**

   Open two terminal windows:

   ```bash
   # Terminal 1 — Backend API
   php artisan serve
   # Runs on http://localhost:8000

   # Terminal 2 — Frontend
   cd frontend
   npm run dev
   # Runs on http://localhost:5173
   ```

8. **Access the application**

   Navigate to `http://localhost:5173` in your browser.

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Manager | manager@example.com | password |
| Employee | employee@example.com | password |

## API Documentation

Full API reference is available in [API.md](API.md).

## Future Plans

- **Reports** — Generate leave reports by department, date range, and leave type with CSV/PDF export
- **Notifications** — Real-time alerts for leave approval status changes
- **Dark Mode** — System-wide dark theme with Tailwind dark variant
- **Team Calendar** — View team members' approved leaves in a visual monthly calendar
- **Deployment** — Docker setup with CI/CD pipeline for automated testing
