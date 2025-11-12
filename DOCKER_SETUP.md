# Running TaskFlow with Docker (No PHP Installation Required!)

## Prerequisites

1. **Install Docker Desktop** for Mac: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Open Docker Desktop and make sure it's running

## Setup Laravel Sail

Laravel Sail uses Docker to run your entire application without needing PHP installed locally!

### 1. Install Composer Dependencies (one-time setup)

Since you don't have PHP yet, we'll use Docker to run composer:

```bash
cd /Users/lcostash/Domains/cursor/tasks

# Run composer via Docker
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php82-composer:latest \
    composer install --ignore-platform-reqs
```

### 2. Configure Sail in composer.json

The project already has Sail in the dependencies. Now configure it:

```bash
# Copy .env file if not done already
cp .env.example .env
```

### 3. Start Sail

```bash
./vendor/bin/sail up -d
```

This will:
- ✅ Download and start MySQL container
- ✅ Download and start PHP container
- ✅ Start your Laravel app
- ✅ All without installing PHP!

### 4. Setup the Database

```bash
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate
./vendor/bin/sail artisan db:seed
```

### 5. Install Node Dependencies & Start Vite

```bash
# Install npm packages
./vendor/bin/sail npm install

# Start Vite dev server (in a separate terminal)
./vendor/bin/sail npm run dev
```

### 6. Access the App

Open browser to: **http://localhost**

(With Sail, it runs on port 80 by default)

## Useful Sail Commands

```bash
# Stop containers
./vendor/bin/sail down

# Start containers
./vendor/bin/sail up -d

# View logs
./vendor/bin/sail logs

# Run artisan commands
./vendor/bin/sail artisan [command]

# Run composer commands
./vendor/bin/sail composer [command]

# Run npm commands
./vendor/bin/sail npm [command]

# Access MySQL
./vendor/bin/sail mysql

# SSH into the container
./vendor/bin/sail shell
```

## Make Sail Easier to Use

Add this alias to your `~/.zshrc` or `~/.bash_profile`:

```bash
alias sail='./vendor/bin/sail'
```

Then reload:
```bash
source ~/.zshrc
```

Now you can just type:
```bash
sail up -d
sail artisan migrate
sail npm run dev
```

## Benefits of Using Sail

✅ No PHP installation required  
✅ Isolated environment (won't affect your system)  
✅ Includes MySQL, Redis, Mailpit (for email testing)  
✅ Same environment for all developers  
✅ Easy to reset/clean  

## Email Testing with Mailpit

Sail includes Mailpit (better than Mailtrap for local dev):

1. Access Mailpit web UI: **http://localhost:8025**
2. All OTP emails will appear here automatically!
3. No Mailtrap configuration needed!

Just update your `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
```

---

**This is the easiest way if you don't want to install PHP!** 🐳

