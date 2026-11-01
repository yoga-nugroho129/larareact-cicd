# ==============================================================================
# Main docker for REAL USAGE
# ==============================================================================

FROM php:8.4-fpm

WORKDIR /var/www

RUN apt-get update \
    && apt-get install -y libzip-dev curl \
    && docker-php-ext-install zip pdo_mysql \
    && curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install \
    --no-dev \
    --optimize-autoloader

RUN npm ci \
    && npm run build

RUN chown -R www-data:www-data \
    storage \
    bootstrap/cache

CMD [ "php-fpm" ]