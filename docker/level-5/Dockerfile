# ==============================================================================
# DRILL 5: Jenkins → Docker Hub → Deploy to VPS
# Learning: Multi-stage Dockerfile for Production (PHP-FPM & Nginx Separation)
# Status  : Learning Material / Lab
# ==============================================================================

# =========================================================
# STAGE 1 — BUILD
# Laravel + Composer + Node
# =========================================================
FROM php:8.4-cli AS builder

WORKDIR /var/www

# System dependencies
RUN apt-get update \
    && apt-get install -y \
        libzip-dev \
        curl \
        git \
    && docker-php-ext-install \
        zip \
        pdo_mysql \
    && curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

# Install production PHP dependencies
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader

RUN npm ci

RUN npm run build


# =========================================================
# STAGE 2 — LARAVEL RUNTIME
# PHP-FPM only
# =========================================================
FROM php:8.4-fpm AS laravel

WORKDIR /var/www

RUN apt-get update \
    && apt-get install -y \
        libzip-dev \
    && docker-php-ext-install \
        zip \
        pdo_mysql \
    && rm -rf /var/lib/apt/lists/*

# Application source
COPY --from=builder /var/www /var/www

# PHP-FPM user owns writable Laravel directories
RUN chown -R www-data:www-data \
    storage \
    bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]


# =========================================================
# STAGE 3 — NGINX RUNTIME
# =========================================================
FROM nginx:alpine AS nginx

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Nginx gets its own copy of Laravel public directory.
# It needs public/index.php + public/build/*
COPY --from=builder /var/www/public /var/www/public