# Task Management App

A modern fullstack task management and Kanban board application built with Laravel, Inertia.js, React, and Tailwind CSS.

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js & npm

### Local Setup

```bash
# Install dependencies
composer install
npm install

# Setup environment & database
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link

# Run development servers
npm run dev
php artisan serve
```
