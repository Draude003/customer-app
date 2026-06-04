# Customer Management Application

A simple CRUD application for managing customer records, built with Laravel, React.js, and Elasticsearch.

## Tech Stack

- **Backend:** Laravel 11 (PHP)
- **Frontend:** React.js with Vite
- **Database:** MySQL 8.0
- **Search:** Elasticsearch 8.12
- **Load Balancer:** Nginx
- **Containerization:** Docker & Docker Compose

## Requirements

Make sure you have the following installed before running the application:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)


## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Draude003/customer-app.git
cd customer-app
```

### 2. Start the Docker containers

```bash
docker-compose up -d
```

This will start the following services:
- **api** - Laravel backend (PHP-FPM)
- **nginx** - Load balancer/reverse proxy
- **database** - MySQL database
- **searcher** - Elasticsearch

 ### 3. Run the database migrations

```bash
docker-compose exec api php artisan migrate
```

### 4. Sync existing customers to Elasticsearch

```bash
docker-compose exec api php artisan customers:sync-elasticsearch
```

### 5. Install frontend dependencies

```bash
cd frontend
npm install
```

### 6. Start the frontend

```bash
npx vite
```

### 7. Open the application

Open your browser and go to:
http://localhost:5173

## Running Tests

```bash
docker-compose exec api php artisan test
```

## Stopping the Application

```bash
docker-compose down
```