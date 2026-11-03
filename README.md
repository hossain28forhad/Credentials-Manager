# Credential Manager

A secure web-based Credential Management System built with **Laravel 13, React, Inertia.js, and Tailwind CSS**.

Credential Manager helps administrators and managers securely manage website information and login credentials from a centralized dashboard.

## Project Overview

Credential Manager is designed to manage multiple websites, their login credentials, managers, permissions, and user activities.

The system includes role-based access control so administrators can manage users and assign permissions according to their responsibilities.

## Technology Stack

### Backend
- PHP 8.5
- Laravel 13
- Laravel Fortify
- MySQL
- Spatie Laravel Permission

### Frontend
- React
- TypeScript
- Inertia.js
- Tailwind CSS
- Lucide React Icons

### Development Tools
- Node.js
- pnpm
- Ubuntu WSL
- Git & GitHub

## Features

### 1. Authentication
- User authentication
- Login and logout
- Email verification support
- Protected routes

### 2. Role & Permission Management
Two primary roles:

- **Super Admin**
- **Manager**

Features:
- Role-based access control
- Permission-based route protection
- Assign permissions to managers
- Super Admin can manage managers
- Managers can access features according to assigned permissions

### 3. Manager Management
- Create managers
- View manager list
- Edit manager information
- Delete managers
- Assign permissions to managers
- Manage manager access

### 4. Website Management
- Add websites
- View website list
- Edit website information
- Delete websites
- Website name
- Website URL
- Website category
- Website description
- Unique DFID field

### 5. Credential Management
- Add website credentials
- View credential list
- Edit credentials
- Delete credentials
- Associate credentials with websites
- Store username and email
- Store encrypted passwords
- Store login URL and notes
- Search credentials

### 6. Password Security
- Laravel encrypted password casting
- Password visibility control
- Password copy functionality
- Strong password generator
- Separate password-view permission planned for access control

### 7. Activity Logs
Track important credential activities:

- Credential created
- Credential updated
- Credential deleted
- Password viewed

Activity information includes:
- User name
- Credential information
- Website information
- Action type
- IP address
- User agent
- Activity date and time

Historical credential and website names are being preserved for future activity records, even after deletion.

### 8. Dashboard
Dynamic dashboard statistics:

- Total Managers
- Total Websites
- Total Credentials
- Total Activities

Additional sections:
- Recent Activities
- System Overview
- Current User Role
- System Status

Dashboard statistics and recent activities are loaded from the Laravel backend.

### 9. Activity Log Management
- View activity history
- Search users and credentials
- Filter by activity type
- Paginated activity table
- Display IP addresses
- Display activity timestamps

### 10. Bangladesh Timezone
Application timezone:

`Asia/Dhaka`

All displayed application timestamps use Bangladesh local time.

## Permission Structure

The following permissions are implemented or used by the project:

| Permission | Description |
|---|---|
| `dashboard.view` | View dashboard |
| `manager.view` | View managers |
| `manager.create` | Create managers |
| `manager.edit` | Edit managers |
| `manager.delete` | Delete managers |
| `website.view` | View websites |
| `website.create` | Create websites |
| `website.edit` | Edit websites |
| `website.delete` | Delete websites |
| `activity.view` | View activity logs |

Credential permissions are part of the upcoming access-control phase:

- `credential.view`
- `credential.create`
- `credential.edit`
- `credential.delete`
- `credential.password.view`

## Installation

### 1. Clone Repository

```bash
git clone YOUR_REPOSITORY_URL
cd credential-manager
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Environment Configuration

```bash
cp .env.example .env
php artisan key:generate
```

Configure your database credentials in `.env`:

```env
APP_NAME="Credential Manager"
APP_ENV=local
APP_DEBUG=true
APP_TIMEZONE=Asia/Dhaka

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=credential_manager
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Install Frontend Dependencies

```bash
pnpm install
```

### 5. Run Database Migrations

```bash
php artisan migrate
```

Make sure your required roles, permissions, and Super Admin account have been configured.

### 6. Start Development Server

Laravel:

```bash
php artisan serve
```

Frontend:

```bash
pnpm dev
```

Open:

`http://127.0.0.1:8000`

## Production Build

Build frontend assets:

```bash
pnpm build
```

Clear Laravel caches:

```bash
php artisan optimize:clear
```

## Project Structure

Important project directories:

```text
credential-manager/
│
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── DashboardController.php
│   │       ├── ManagerController.php
│   │       ├── WebsiteController.php
│   │       ├── CredentialController.php
│   │       └── CredentialActivityController.php
│   │
│   └── Models/
│       ├── User.php
│       ├── Website.php
│       ├── Credential.php
│       └── CredentialActivity.php
│
├── database/
│   └── migrations/
│
├── resources/
│   └── js/
│       ├── components/
│       └── pages/
│           ├── dashboard.tsx
│           ├── managers/
│           ├── websites/
│           ├── credentials/
│           └── activity-logs/
│
├── routes/
│   └── web.php
│
└── README.md
```

## Security Notes

- Passwords are encrypted using Laravel's encrypted model casting.
- Password values must never be stored in activity logs.
- Access to protected features should be controlled through permissions.
- Sensitive credentials should only be exposed to authorized users.
- Production deployments should use HTTPS and secure environment configuration.
- Do not commit `.env` files or production secrets to Git.

## Current Project Status

| Module | Status |
|---|---|
| Laravel & React Setup | Completed |
| Authentication | Completed |
| Role & Permission Setup | Completed |
| Manager Management | Completed |
| Website Management | Completed |
| Credential Management | Completed |
| Password Generator | Implemented |
| Password Copy | Implemented |
| Activity Logging | Completed |
| Activity Log UI | Completed |
| Dynamic Dashboard | Completed |
| Bangladesh Timezone | Completed |
| Credential Permission Enforcement | Upcoming |
| Advanced Security Improvements | Upcoming |

## Future Improvements

- Complete credential-specific permission enforcement
- Improve password access security
- Add security overview and analytics
- Add advanced audit log filters
- Add credential sharing and access management
- Add backup and recovery functionality
- Add production deployment and CI/CD

## License

This project is currently under development. License details can be added before public distribution.

---

**Credential Manager**  
Built with Laravel 13, React, Inertia.js, and Tailwind CSS.