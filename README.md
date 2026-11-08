# Website Credential Manager

A secure and modern web-based credential management system built with **Laravel 13, React, Inertia.js, and Tailwind CSS**.

Website Credential Manager helps administrators manage website information, securely store login credentials, manage users, control permissions, and monitor account activities through a centralized dashboard.

## Author

**Forhad Hossain**

## Tech Stack

### Backend
- Laravel 13
- PHP 8.5+
- MySQL
- Laravel Fortify
- Spatie Laravel Permission

### Frontend
- React
- TypeScript
- Inertia.js
- Tailwind CSS
- Lucide React
- Vite
- pnpm

## Features

### 1. Authentication System
- User Registration
- User Login and Logout
- Secure Password Management
- Password Confirmation
- Laravel Fortify Authentication
- Custom Welcome Page
- Custom Login Page
- Custom Registration Page

### 2. Role & Permission Management
Two primary roles are available:

- **Super Admin**
- **Manager**

Super Admin can:
- Create Managers
- Edit Manager Information
- Delete Managers
- Assign Permissions to Managers
- Manage Manager Access

Managers can access features according to their assigned permissions.

### 3. Dashboard
- Dynamic Dashboard Statistics
- Total Managers
- Total Websites
- Total Credentials
- Recent Activities
- Dashboard Analytics

### 4. Website Management
- Add New Websites
- Edit Website Information
- Delete Websites
- View Website Details
- Website Name
- Unique DFID
- Website URL
- Category
- Description
- Track Website Creator

### 5. Credential Management
- Store Website Credentials
- Manage Usernames and Passwords
- Store Email Addresses
- Store Login URLs
- Add Credential Notes
- Edit Credentials
- Delete Credentials
- Copy Credentials
- Secure Password Encryption
- Password Visibility Management

### 6. Activity Logs
Track important system activities, including:

- Credential Created
- Credential Updated
- Credential Deleted
- Password Viewed
- Unauthorized Access Attempts

### 7. Login History
- Track User Login Activities
- Monitor Login History
- Access Controlled by Permissions

### 8. Security Settings

#### Two-Factor Authentication (2FA)
- Enable Two-Factor Authentication
- Google Authenticator Support
- QR Code Setup
- Manual Setup Key
- OTP Verification
- Disable Two-Factor Authentication
- Recovery Codes
- View and Copy Recovery Codes
- Regenerate Recovery Codes
- Two-Factor Login Verification

#### Additional Security
- Password Update
- Passkeys Support
- Password Confirmation for Sensitive Actions

### 9. User Interface & Experience
- Modern Dashboard Design
- Responsive Layout
- Dark Mode by Default
- Light Mode Support
- Theme Switching
- Consistent UI Components
- Sidebar Navigation
- Custom Error Pages
- Professional Security Settings UI

### 10. Error Handling
- Custom 403 Forbidden Page
- Unauthorized Access Handling
- Unauthorized Access Logging

## Permission List

The application uses permission-based access control.

| Permission | Description |
|---|---|
| `dashboard.view` | View Dashboard |
| `manager.view` | View Managers |
| `manager.create` | Create Managers |
| `manager.edit` | Edit Managers |
| `manager.delete` | Delete Managers |
| `website.view` | View Websites |
| `website.create` | Create Websites |
| `website.edit` | Edit Websites |
| `website.delete` | Delete Websites |
| `credential.view` | View Credentials |
| `credential.create` | Create Credentials |
| `credential.edit` | Edit Credentials |
| `credential.delete` | Delete Credentials |
| `credential.copy` | Copy Credentials |
| `password.view` | View Stored Passwords |
| `activity.view` | View Activity Logs |
| `login-activity.view` | View Login History |

Super Admin has access to all permissions.

## Installation

### Requirements
- PHP 8.5+
- Composer
- Node.js
- pnpm
- MySQL
- Laravel 13

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

```bash
cd credential-manager
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Frontend Dependencies

```bash
pnpm install
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Update your database credentials in the `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=credential_manager
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 6. Run Database Migrations

```bash
php artisan migrate
```

If your project uses seeders:

```bash
php artisan db:seed
```

### 7. Start the Development Server

Run Laravel:

```bash
php artisan serve
```

Run Vite:

```bash
pnpm dev
```

Open the application:

```text
http://127.0.0.1:8000
```

## Development Commands

### Run TypeScript Checks

```bash
pnpm run types:check
```

### Build Frontend Assets

```bash
pnpm run build
```

### Clear Laravel Cache

```bash
php artisan optimize:clear
```

### View Application Routes

```bash
php artisan route:list
```

## Security Highlights

- Encrypted credential passwords
- Role-based access control
- Permission-based authorization
- Two-Factor Authentication
- Recovery Codes
- Password confirmation for sensitive actions
- Activity monitoring
- Unauthorized access logging

## Project Status

**Development Status: Active**

The core credential management functionality, role and permission management, dashboard, activity monitoring, login history, UI improvements, and Two-Factor Authentication have been implemented.

Additional improvements and testing may be added in future updates.

## License

This project is developed by **Forhad Hossain**.