# 🚀 TaskFlow - Setup From Git Repository

Complete guide to get TaskFlow running on your local machine after cloning from Git.

## ⚠️ Prerequisites

Before you start, make sure you have installed:

1. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop)
   - For Mac: Install Docker Desktop for Mac
   - For Windows: Install Docker Desktop for Windows
   - For Linux: Install Docker Engine

2. **Git** - Usually pre-installed on Mac/Linux
   - Check: Run `git --version` in terminal

## 📦 Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd tasks
```

## 🐳 Step 2: Install PHP Dependencies (using Docker)

Since you don't have Composer installed locally, use the official Composer Docker image:

```bash
docker run --rm \
    -v "$(pwd)":/app \
    -w /app \
    composer:latest install --ignore-platform-reqs
```

**What this does:**
- Downloads all PHP/Laravel packages into `vendor/` folder
- Takes about 1-2 minutes

**Expected output:** You should see "115 packages" installed.

## ⚙️ Step 3: Setup Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

The default settings should work fine for local development with Docker.

## 🚢 Step 4: Start Docker Containers

Start all services (Laravel, MySQL, Mailpit):

```bash
docker-compose up -d
```

**What this does:**
- Starts Laravel application container (port 80)
- Starts MySQL database container (port 3306)
- Starts Mailpit email testing service (port 8025)

**Wait 10-15 seconds** for containers to fully start up.

Verify containers are running:

```bash
docker ps
```

You should see 3 containers: `tasks-laravel.test-1`, `tasks-mysql-1`, `tasks-mailpit-1`

## 📦 Step 5: Install Node.js Dependencies (inside Docker)

Install npm packages inside the Laravel container:

```bash
docker exec tasks-laravel.test-1 bash -c "cd /var/www/html && rm -rf node_modules package-lock.json && npm install"
```

**What this does:**
- Installs all JavaScript/React packages
- Takes about 20-30 seconds
- Creates `node_modules/` folder with 266 packages

## 🔑 Step 6: Generate Application Key

```bash
docker exec tasks-laravel.test-1 php artisan key:generate
```

**What this does:**
- Generates a unique encryption key for your application
- Updates the `.env` file automatically

## 🗄️ Step 7: Setup Database

Run migrations and seed sample data:

```bash
docker exec tasks-laravel.test-1 php artisan migrate --force
docker exec tasks-laravel.test-1 php artisan db:seed --force
```

**What this does:**
- Creates all database tables
- Adds sample users and tasks for testing

## ⚡ Step 8: Start Vite Dev Server

Start the frontend development server:

```bash
docker exec -d tasks-laravel.test-1 bash -c "cd /var/www/html && npm run dev"
```

**What this does:**
- Starts Vite to compile and serve React/JavaScript assets
- Runs in the background on port 5173

**Wait 5-10 seconds** for Vite to fully start.

## ✅ Step 9: Access the Application

Open your browser and go to:

👉 **http://localhost** 👈

You should see the **TaskFlow landing page** with:
- Beautiful blue and white design
- "TaskFlow" logo in the header
- "Login" button in the top right
- Hero section with features

## 🔐 Step 10: Test Login

Click "Login" and try one of these test accounts:

**Admin Account:**
- Email: `admin@taskflow.com`

**Regular Users:**
- `john@example.com`
- `jane@example.com`
- `bob@example.com`
- `alice@example.com`

**How OTP Login Works:**
1. Enter any of the above emails
2. Click "Send Code"
3. Open Mailpit at **http://localhost:8025**
4. Find the OTP email and copy the 6-digit code
5. Enter the code and login

## 🛑 Stopping the Application

When you're done, stop all containers:

```bash
docker-compose down
```

## 🔄 Starting Again Later

To start the application after you've set it up once:

```bash
# Start containers
docker-compose up -d

# Wait 10 seconds, then start Vite
docker exec -d tasks-laravel.test-1 bash -c "cd /var/www/html && npm run dev"

# Wait 5 seconds, then open http://localhost
```

## 🐛 Troubleshooting

### Blank Page / Empty Screen

**Problem:** You see a white/blank page at http://localhost

**Solution:** Vite dev server is not running. Start it:

```bash
docker exec -d tasks-laravel.test-1 bash -c "cd /var/www/html && npm run dev"
```

Wait 5-10 seconds, then refresh the page with `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux).

### Container Already Running Error

**Problem:** Error says "port 80 is already in use"

**Solution:**

```bash
# Stop existing containers
docker-compose down

# Start again
docker-compose up -d
```

### Database Connection Error

**Problem:** Laravel shows "could not connect to database"

**Solution:**

```bash
# Check if MySQL container is running
docker ps | grep mysql

# If not running, restart containers
docker-compose down
docker-compose up -d

# Wait 15 seconds for MySQL to start, then run migrations again
docker exec tasks-laravel.test-1 php artisan migrate --force
```

### Composer Install Fails (Architecture Error)

**Problem:** Error about architecture mismatch or platform requirements

**Solution:** The `--ignore-platform-reqs` flag should handle this, but if it still fails:

```bash
docker run --rm \
    -v "$(pwd)":/app \
    -w /app \
    composer:latest install --ignore-platform-reqs --no-scripts
```

### NPM Install Fails Inside Container

**Problem:** npm install fails or Vite won't start

**Solution:**

```bash
# Clean install of node modules
docker exec tasks-laravel.test-1 bash -c "cd /var/www/html && rm -rf node_modules package-lock.json && npm cache clean --force && npm install"
```

### Cannot Access Mailpit

**Problem:** Can't open http://localhost:8025

**Solution:**

```bash
# Check if mailpit container is running
docker ps | grep mailpit

# If not running, restart containers
docker-compose down
docker-compose up -d
```

## 📱 Quick Command Reference

```bash
# View container logs
docker logs tasks-laravel.test-1

# Access Laravel container shell
docker exec -it tasks-laravel.test-1 bash

# Run artisan commands
docker exec tasks-laravel.test-1 php artisan [command]

# Run composer commands
docker exec tasks-laravel.test-1 composer [command]

# Run npm commands
docker exec tasks-laravel.test-1 npm [command]

# View all running containers
docker ps

# Stop all containers
docker-compose down

# Start containers
docker-compose up -d

# Restart containers
docker-compose restart
```

## 📝 Project Structure

```
tasks/
├── app/                    # Laravel application code
├── resources/
│   ├── js/                # React components (Inertia.js)
│   └── css/               # Stylesheets
├── routes/                # Application routes
├── database/
│   ├── migrations/        # Database structure
│   └── seeders/           # Sample data
├── vendor/                # PHP dependencies (generated)
├── node_modules/          # Node dependencies (generated)
├── .env                   # Environment configuration
├── compose.yaml           # Docker configuration
└── README.md             # Project overview
```

## 🎉 You're All Set!

Your TaskFlow application is now running locally. Enjoy task management! 🚀

### What You Can Do:

- ✅ Drag and drop tasks between columns (To Do, In Progress, Done)
- ✅ Create new tasks with tags, due dates, and descriptions
- ✅ Manage your profile
- ✅ Login as admin to see user management features
- ✅ Create custom tags for organizing tasks

### Need Help?

Check the other documentation files:
- `README.md` - Project overview
- `QUICK_START.md` - Quick reference guide
- `TASKFLOW_README.md` - Complete feature documentation
- `DOCKER_SETUP.md` - Detailed Docker information

---

**Happy Task Managing! 📋✨**

