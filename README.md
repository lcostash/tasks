# 📋 TaskFlow - Modern Task Management System

A beautiful, modern task management application built with Laravel, React (Inertia.js), and TailwindCSS. Features passwordless authentication via OTP, drag-and-drop Kanban boards, and comprehensive user management.

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat&logo=laravel)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat&logo=tailwind-css)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)

## ✨ Features

- 🔐 **Passwordless Authentication** - Secure OTP-based login via email
- 📊 **Kanban Board** - Drag and drop tasks between columns (To Do, In Progress, Done)
- 🏷️ **Tag System** - Organize tasks with custom and system-wide tags
- 👥 **User Management** - Admin panel for managing users
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🎨 **Modern Stack** - Laravel 12 + React 18 + Inertia.js + TailwindCSS
- 🐳 **Docker Ready** - One-command setup with Docker Compose
- 📧 **Email Testing** - Built-in Mailpit for testing OTP emails

## 🚀 Quick Start

### For First Time Setup (Cloning from Git)

**👉 See [SETUP_FROM_GIT.md](SETUP_FROM_GIT.md) for complete step-by-step instructions**

Quick version:

```bash
# 1. Clone repository
git clone <your-repo-url>
cd tasks

# 2. Install PHP dependencies
docker run --rm -v "$(pwd)":/app -w /app composer:latest install --ignore-platform-reqs

# 3. Setup environment
cp .env.example .env

# 4. Start Docker containers
docker-compose up -d

# 5. Install Node dependencies
docker exec tasks-laravel.test-1 bash -c "cd /var/www/html && npm install"

# 6. Generate app key
docker exec tasks-laravel.test-1 php artisan key:generate

# 7. Setup database
docker exec tasks-laravel.test-1 php artisan migrate --force
docker exec tasks-laravel.test-1 php artisan db:seed --force

# 8. Start Vite dev server
docker exec -d tasks-laravel.test-1 bash -c "cd /var/www/html && npm run dev"

# 9. Open http://localhost in your browser
```

### For Daily Development

```bash
# Start application
docker-compose up -d
docker exec -d tasks-laravel.test-1 bash -c "cd /var/www/html && npm run dev"

# Stop application
docker-compose down
```

## 📚 Documentation

- **[SETUP_FROM_GIT.md](SETUP_FROM_GIT.md)** - Complete setup guide for new developers
- **[QUICK_START.md](QUICK_START.md)** - Quick reference guide
- **[TASKFLOW_README.md](TASKFLOW_README.md)** - Detailed feature documentation
- **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Docker configuration details
- **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)** - Development workflow guide

## 🔑 Test Accounts

After running `php artisan db:seed`, you can login with:

**Admin Account:**
- Email: `admin@taskflow.com`

**Regular Users:**
- `john@example.com`
- `jane@example.com`
- `bob@example.com`
- `alice@example.com`

**OTP Email Testing:**
Access Mailpit at **http://localhost:8025** to retrieve OTP codes.

## 🛠️ Tech Stack

**Backend:**
- Laravel 12
- PHP 8.2+
- MySQL 8.0
- Inertia.js

**Frontend:**
- React 18
- TailwindCSS 3
- Vite
- Headless UI

**DevOps:**
- Docker & Docker Compose
- Laravel Sail
- Mailpit

## 📱 Application Structure

```
tasks/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # API endpoints and page controllers
│   │   └── Middleware/      # Custom middleware (Admin, Inertia)
│   ├── Models/              # Eloquent models (User, Task, Tag, OtpCode)
│   └── Policies/            # Authorization policies
├── resources/
│   ├── js/
│   │   ├── Components/      # Reusable React components
│   │   ├── Layouts/         # Page layouts
│   │   └── Pages/           # Inertia pages
│   └── css/                 # Stylesheets
├── database/
│   ├── migrations/          # Database schema
│   └── seeders/             # Sample data
├── routes/
│   ├── web.php             # Web routes
│   └── auth.php            # Authentication routes
└── compose.yaml            # Docker configuration
```

## 🎯 Key Features Explained

### Passwordless OTP Authentication
- Users receive a 6-digit code via email
- Codes expire after 10 minutes
- Codes can only be used once
- Rate limiting to prevent abuse

### Kanban Board
- Three columns: To Do, In Progress, Done
- Drag and drop to move tasks
- Visual status indicators
- Real-time updates

### Tag System
- System tags (visible to all users)
- User tags (personal organization)
- Color-coded for easy identification
- Admin can manage system tags

### Admin Panel
- View and manage all users
- View any user's tasks
- Manage system-wide tags
- Platform statistics

## 🐳 Docker Services

The application runs three Docker containers:

1. **Laravel Application** (`tasks-laravel.test-1`)
   - PHP 8.4
   - Node.js & npm
   - Port: 80

2. **MySQL Database** (`tasks-mysql-1`)
   - MySQL 8.0
   - Port: 3306

3. **Mailpit** (`tasks-mailpit-1`)
   - Email testing
   - Web UI: Port 8025
   - SMTP: Port 1025

## 🔧 Common Commands

```bash
# Run artisan commands
docker exec tasks-laravel.test-1 php artisan [command]

# Access container shell
docker exec -it tasks-laravel.test-1 bash

# View logs
docker logs tasks-laravel.test-1

# Run tests
docker exec tasks-laravel.test-1 php artisan test

# Clear cache
docker exec tasks-laravel.test-1 php artisan cache:clear

# Fresh database
docker exec tasks-laravel.test-1 php artisan migrate:fresh --seed
```

## 🐛 Troubleshooting

**Blank page at http://localhost**
```bash
# Start Vite dev server
docker exec -d tasks-laravel.test-1 bash -c "cd /var/www/html && npm run dev"
```

**Database connection errors**
```bash
# Restart containers
docker-compose down
docker-compose up -d
```

**Port already in use**
```bash
# Stop existing containers
docker-compose down
# Kill any process using port 80
lsof -ti:80 | xargs kill -9  # Mac/Linux
```

For more troubleshooting, see [SETUP_FROM_GIT.md](SETUP_FROM_GIT.md#-troubleshooting)

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🙏 Acknowledgments

Built with:
- [Laravel](https://laravel.com) - The PHP framework
- [React](https://reactjs.org) - UI library
- [Inertia.js](https://inertiajs.com) - Modern monolith
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS
- [Laravel Sail](https://laravel.com/docs/sail) - Docker development environment

---

**Made with ❤️ using Laravel and React**
