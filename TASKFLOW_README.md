# TaskFlow - Task Management Application

A modern, feature-rich task management web application built with Laravel and React. TaskFlow offers a beautiful Kanban-style board, OTP-based authentication, role-based access control, and comprehensive admin features.

## Features

### 🔐 Authentication
- **Passwordless OTP Login** - Secure login via one-time passwords sent to email
- **Auto-Registration** - New users are automatically created on first login
- **Email Verification** - Built-in email verification support

### 📋 Task Management
- **Kanban Board** - Drag-and-drop tasks between To Do, In Progress, and Done columns
- **Rich Task Details** - Title, description, due dates, and custom tags
- **Smart Tagging** - System-wide tags and user-created custom tags
- **Task Filtering** - Show/hide completed tasks
- **Overdue Indicators** - Visual indicators for overdue tasks

### 👥 User Management
- **User Profiles** - Full name, phone, email management
- **Role-Based Access** - Admin and User roles
- **Privacy First** - Users only see their own tasks

### 🛡️ Admin Features
- **Admin Dashboard** - Overview of users, tasks, and tags
- **User Management** - View, edit, and delete users
- **View User Tasks** - Admins can view any user's dashboard
- **System Tags** - Manage tags available to all users
- **Comprehensive Statistics** - User counts, task counts, and more

### 🎨 Modern Design
- **Blue & White Theme** - Clean, professional color scheme
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Beautiful Landing Page** - Modern homepage for non-authenticated users
- **Smooth Animations** - Polished UI with smooth transitions

## Tech Stack

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 18, Inertia.js 2.0
- **Styling**: Tailwind CSS 3
- **Database**: SQLite (easily switchable to MySQL/PostgreSQL)
- **Authentication**: Custom OTP system
- **UI Components**: Headless UI

## Installation

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- SQLite (or MySQL/PostgreSQL)

### Setup Steps

1. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Configure Email (Mailtrap)**
   
   Edit `.env` and add your Mailtrap credentials:
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USERNAME=your_mailtrap_username
   MAIL_PASSWORD=your_mailtrap_password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS="noreply@taskflow.com"
   MAIL_FROM_NAME="TaskFlow"
   ```

4. **Database Setup**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

5. **Build Assets**
   ```bash
   npm run build
   ```

## Development

Run the development servers:

```bash
# Option 1: Use composer script (runs all services)
composer dev

# Option 2: Manual approach
# Terminal 1 - Laravel
php artisan serve

# Terminal 2 - Vite
npm run dev

# Terminal 3 - Queue worker (for emails)
php artisan queue:work
```

Visit: `http://localhost:8000`

## Default Credentials

After seeding, you can login with:

- **Admin**: `admin@taskflow.com`
- **Users**: 
  - `john@example.com`
  - `jane@example.com`
  - `bob@example.com`
  - `alice@example.com`

**Note**: In production, these emails will receive OTP codes. For development with Mailtrap, check your Mailtrap inbox for the codes.

## Application Structure

### Backend

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/OtpController.php          # OTP authentication
│   │   ├── TaskController.php              # Task CRUD operations
│   │   ├── TagController.php               # Tag management
│   │   ├── AdminController.php             # Admin functionality
│   │   └── ProfileController.php           # User profile
│   ├── Middleware/
│   │   ├── AdminMiddleware.php             # Admin-only routes
│   │   └── HandleInertiaRequests.php       # Share auth data
│   └── Requests/
│       └── ProfileUpdateRequest.php        # Profile validation
├── Models/
│   ├── User.php                            # User model with roles
│   ├── Task.php                            # Task model
│   ├── Tag.php                             # Tag model
│   └── OtpCode.php                         # OTP code model
└── Policies/
    └── TaskPolicy.php                      # Task authorization
```

### Frontend

```
resources/js/
├── Pages/
│   ├── Welcome.jsx                         # Landing page
│   ├── Dashboard.jsx                       # User dashboard with Kanban
│   ├── Auth/
│   │   ├── OtpLogin.jsx                   # Email input for OTP
│   │   └── OtpVerify.jsx                  # OTP code verification
│   ├── Profile/
│   │   └── Edit.jsx                       # Profile management
│   └── Admin/
│       ├── Dashboard.jsx                   # Admin stats
│       ├── Users.jsx                       # User list
│       ├── UserDetails.jsx                 # User details/edit
│       ├── UserDashboard.jsx               # View user's tasks
│       └── SystemTags.jsx                  # System tag management
├── Components/
│   ├── KanbanColumn.jsx                    # Kanban board column
│   ├── TaskCard.jsx                        # Individual task card
│   ├── TaskModal.jsx                       # Create/edit task modal
│   └── TagBadge.jsx                        # Tag display component
└── Layouts/
    ├── AuthenticatedLayout.jsx             # Authenticated user layout
    └── GuestLayout.jsx                     # Guest user layout
```

### Database

```
database/
├── migrations/
│   ├── *_add_user_profile_fields_to_users_table.php
│   ├── *_create_tasks_table.php
│   ├── *_create_tags_table.php
│   ├── *_create_task_tag_table.php
│   └── *_create_otp_codes_table.php
└── seeders/
    └── DatabaseSeeder.php                  # Sample data
```

## API Endpoints

### Tasks
- `GET /tasks` - List user's tasks
- `POST /tasks` - Create new task
- `GET /tasks/{task}` - Get task details
- `PATCH /tasks/{task}` - Update task
- `DELETE /tasks/{task}` - Delete task
- `PATCH /tasks/{task}/status` - Update task status

### Tags
- `GET /tags` - List available tags
- `POST /tags` - Create user tag
- `PATCH /tags/{tag}` - Update tag
- `DELETE /tags/{tag}` - Delete tag

### Admin
- `GET /admin` - Admin dashboard
- `GET /admin/users` - List all users
- `GET /admin/users/{user}` - User details
- `GET /admin/users/{user}/dashboard` - View user's tasks
- `PATCH /admin/users/{user}` - Update user
- `DELETE /admin/users/{user}` - Delete user
- `GET /admin/tags` - System tags page
- `POST /admin/tags/system` - Create system tag
- `PATCH /admin/tags/system/{tag}` - Update system tag
- `DELETE /admin/tags/system/{tag}` - Delete system tag

## Security Features

- **OTP-Based Authentication** - No password storage vulnerabilities
- **Role-Based Access Control** - Admin and User roles
- **Policy-Based Authorization** - Laravel policies for task access
- **Gates** - Fine-grained permission checks
- **CSRF Protection** - Built-in Laravel CSRF
- **SQL Injection Protection** - Eloquent ORM
- **XSS Protection** - React's built-in escaping

## Configuration

### Email Provider (Mailtrap)

Mailtrap is configured for development. For production, update `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
```

### Database

Default is SQLite. To use MySQL/PostgreSQL:

1. Update `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=taskflow
   DB_USERNAME=root
   DB_PASSWORD=
   ```

2. Run migrations:
   ```bash
   php artisan migrate:fresh --seed
   ```

## Production Deployment

1. Set environment to production in `.env`:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```

2. Optimize for production:
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   npm run build
   ```

3. Set up queue worker (for emails):
   ```bash
   php artisan queue:work --daemon
   ```

4. Configure your production mail service (not Mailtrap)

5. Set proper file permissions:
   ```bash
   chmod -R 755 storage bootstrap/cache
   ```

## Testing

Run the test suite:

```bash
php artisan test
```

## Troubleshooting

### OTP Emails Not Sending

- Check Mailtrap credentials in `.env`
- Ensure queue worker is running: `php artisan queue:work`
- Check logs: `tail -f storage/logs/laravel.log`

### Database Issues

- Reset database: `php artisan migrate:fresh --seed`
- Check SQLite file permissions: `chmod 664 database/database.sqlite`

### Asset Building Fails

- Clear cache: `npm cache clean --force`
- Reinstall: `rm -rf node_modules && npm install`
- Rebuild: `npm run build`

## Contributing

This is a custom application. For issues or enhancements, please contact the development team.

## License

Proprietary. All rights reserved.

---

**TaskFlow** - Organize Your Work, Achieve Your Goals ✨


