# Installing PHP on macOS

## Check if Homebrew is installed

Open Terminal and run:
```bash
brew --version
```

### If Homebrew is NOT installed:

Install it first:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Install PHP 8.2+

```bash
# Install PHP
brew install php@8.2

# Link it
brew link php@8.2

# Add to PATH (add this to your ~/.zshrc or ~/.bash_profile)
echo 'export PATH="/opt/homebrew/opt/php@8.2/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/php@8.2/sbin:$PATH"' >> ~/.zshrc

# Reload shell
source ~/.zshrc
```

## Verify Installation

```bash
php --version
```

You should see something like: `PHP 8.2.x`

## Install Composer (if not installed)

```bash
brew install composer
```

## Now you can run the Laravel app!

```bash
cd /Users/lcostash/Domains/cursor/tasks

# Install dependencies
composer install

# Start the servers
composer dev
```

## Access the app

Open browser to: **http://localhost:8000**

