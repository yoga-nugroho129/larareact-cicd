FROM php:8.4-cli

WORKDIR /var/www

RUN apt-get update \
    && apt-get install -y libzip-dev curl \
    && docker-php-ext-install zip pdo_mysql \
    && curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
    && apt-get install -y nodejs

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install

RUN npm ci

RUN npm run build