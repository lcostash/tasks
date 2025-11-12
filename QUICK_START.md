# TaskFlow - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
composer install
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Configure Mailtrap (for OTP emails)

Sign up at [mailtrap.io](https://mailtrap.io) (free), then update `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username_here
MAIL_PASSWORD=your_password_here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@taskflow.com"
MAIL_FROM_NAME="TaskFlow"
```

### 4. Setup Database
```bash
php artisan migrate
php artisan db:seed
```

### 5. Start Development Servers

**Option A - All in one (recommended):**
```bash
composer dev
```

**Option B - Manual:**
```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev

# Terminal 3
php artisan queue:work
```

### 6. Open in Browser

Visit: **http://localhost:8000**

## 🔑 Login Credentials

Use these email addresses to login (OTP codes will be in Mailtrap):

- **Admin**: `admin@taskflow.com`
- **Users**: `john@example.com`, `jane@example.com`, `bob@example.com`, `alice@example.com`

## ✨ What You Get

- ✅ Beautiful landing page with white/blue theme
- ✅ OTP-based email authentication (no passwords!)
- ✅ Drag-and-drop Kanban board
- ✅ Task management with tags, due dates, descriptions
- ✅ User profiles with phone and full name
- ✅ Admin panel for user management
- ✅ View any user's tasks (admin only)
- ✅ System-wide and user-specific tags
- ✅ Role-based security (admin/user)
- ✅ Sample data pre-loaded

## 📱 Key Features to Try

1. **Login Flow**: Try the OTP login at `/login`
2. **Dashboard**: Drag tasks between columns
3. **Add Task**: Click "Add Task" and fill out the form
4. **Tags**: Create custom tags or use system tags
5. **Profile**: Update your full name and phone at `/profile`
6. **Admin Panel**: Login as admin to see `/admin` dashboard

## 🎯 Admin Features

As admin, you can:
- View all users at `/admin/users`
- View any user's tasks
- Edit user information
- Manage system-wide tags
- See platform statistics

## 📖 Need More Info?

See [TASKFLOW_README.md](TASKFLOW_README.md) for complete documentation.

## 🐛 Common Issues

**Emails not sending?**
- Make sure queue worker is running: `php artisan queue:work`
- Check Mailtrap credentials in `.env`

**Database errors?**
- Reset: `php artisan migrate:fresh --seed`

**Assets not loading?**
- Make sure Vite is running: `npm run dev`

---

**Happy Task Managing! 🎉**


