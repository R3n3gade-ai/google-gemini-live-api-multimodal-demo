

MIXPOST_DIR=~/repos/mixpost-app
MIXPOST_PORT=8080

if ! command -v php &> /dev/null; then
    echo "PHP is not installed. Installing PHP 8.2..."
    sudo apt update
    sudo apt install -y software-properties-common
    sudo add-apt-repository -y ppa:ondrej/php
    sudo apt update
    sudo apt install -y php8.2 php8.2-cli php8.2-common php8.2-curl php8.2-mbstring php8.2-mysql php8.2-xml php8.2-zip php8.2-bcmath php8.2-gd php8.2-sqlite3
fi

if ! command -v composer &> /dev/null; then
    echo "Composer is not installed. Installing Composer..."
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer
    php -r "unlink('composer-setup.php');"
fi

if [ ! -d "$MIXPOST_DIR" ]; then
    echo "Creating new Laravel application..."
    composer create-project laravel/laravel $MIXPOST_DIR
fi

cd $MIXPOST_DIR

echo "Installing Mixpost package..."
composer require inovector/mixpost

echo "Publishing Mixpost assets..."
php artisan vendor:publish --tag="mixpost-config"
php artisan vendor:publish --tag="mixpost-migrations"
php artisan vendor:publish --tag="mixpost-assets"

echo "Creating SQLite database..."
touch database/database.sqlite
echo "DB_CONNECTION=sqlite" >> .env
echo "DB_DATABASE=$(pwd)/database/database.sqlite" >> .env

echo "Running migrations..."
php artisan migrate

echo "Creating symbolic link for storage..."
php artisan storage:link

echo "Starting Laravel application on port $MIXPOST_PORT..."
php artisan serve --port=$MIXPOST_PORT
