# 🚀 TaskFlow - Getting Started (One Page)

## Prerequisites
- ✅ Docker Desktop installed and running

## Setup (First Time Only)

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd tasks

# 2. Install PHP dependencies (no Composer needed!)
docker run --rm -v "$(pwd)":/app -w /app composer:latest install --ignore-platform-reqs

# 3. Copy environment file
cp .env.example .env

# 4. Start Docker containers
docker-compose up -d

# 5. Install Node.js dependencies inside container
docker exec tasks-laravel.test-1 bash -c "cd /var/www/html && npm install"

# 6. Generate application key
docker exec tasks-laravel.test-1 php artisan key:generate

# 7. Setup database with sample data
docker exec tasks-laravel.test-1 php artisan migrate --force
docker exec tasks-laravel.test-1 php artisan db:seed --force

# 8. Start Vite dev server (for React/JS)
docker exec -d tasks-laravel.test-1 bash -c "cd /var/www/html && npm run dev"

# 9. Open your browser
open http://localhost
```

## Daily Use

```bash
# Start the app
docker-compose up -d
docker exec -d tasks-laravel.test-1 bash -c "cd /var/www/html && npm run dev"

# Stop the app
docker-compose down
```

## Test Accounts

- Admin: `admin@taskflow.com`
- User: `john@example.com`

View OTP codes at: **http://localhost:8025**

## URLs

- **App:** http://localhost
- **Mailpit (OTP emails):** http://localhost:8025

## Troubleshooting

### Blank/Empty Page?
```bash
docker exec -d tasks-laravel.test-1 bash -c "cd /var/www/html && npm run dev"
```

### Database Error?
```bash
docker-compose down
docker-compose up -d
```

### Need Fresh Start?
```bash
docker-compose down
docker run --rm -v "$(pwd)":/app -w /app composer:latest install --ignore-platform-reqs
docker-compose up -d
docker exec tasks-laravel.test-1 bash -c "cd /var/www/html && npm install"
docker exec tasks-laravel.test-1 php artisan key:generate
docker exec tasks-laravel.test-1 php artisan migrate:fresh --seed --force
docker exec -d tasks-laravel.test-1 bash -c "cd /var/www/html && npm run dev"
```

## 📚 More Help

- **Detailed Setup:** [SETUP_FROM_GIT.md](SETUP_FROM_GIT.md)
- **Features Guide:** [TASKFLOW_README.md](TASKFLOW_README.md)
- **Quick Reference:** [QUICK_START.md](QUICK_START.md)

---

That's it! You're ready to go! 🎉

