# Driver Performance Dashboard
> Week 3 — Exploratory Data Analysis on Driver Performance

## Project Structure
driver-performance/
    
    ├── backend-laravel/   
    ├── frontend-next/      
    └── eda-notebooks/       

## Prerequisites
- PHP 8.4+, Composer
- Node.js 18+, npm
- Docker (PostgreSQL + Redis)
- Python 3.10+ with uv

---

## Getting Started

### 1. Start Docker services
```bash
docker-compose up -d
```
Starts PostgreSQL on port `5432` and Redis on port `6379`.

### 2. Backend (Laravel)
```bash
cd backend-laravel

# install dependencies
composer install

# configure environment
cp .env.example .env
# update DB and Redis values in .env

# run migrations
php artisan migrate

# seed dataset
php artisan db:seed

# start server
php artisan serve
```
API runs at `http://localhost:8000`

### 3. Frontend (Next.js)
```bash
cd frontend-next

# install dependencies
npm install

# start dev server
npm run dev
```
Dashboard runs at `http://localhost:3000`

### 4. EDA Notebook
```bash
cd eda-notebooks

# generate dataset
uv run generate_data.py

# launch jupyter
uv run jupyter notebook
# open eda_day1.ipynb
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/metrics/weekly` | Weekly summary |
| GET | `/api/metrics/drivers` | All driver profiles |
| GET | `/api/metrics/drivers/{id}` | Single driver detail |
| GET | `/api/metrics/shift` | Performance by shift |
| GET | `/api/drivers` | Driver list for dropdown |

### Query Parameters
| Parameter | Description | Example |
|-----------|-------------|---------|
| `start` | Start date | `2025-01-01` |
| `end` | End date | `2025-03-31` |
| `sort` | Sort field | `avg_rating` |
| `order` | Sort order | `desc` |
| `limit` | Limit results | `10` |
| `filter` | Filter preset | `interventions` |

---

## Environment Variables (.env)
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=driver_db
DB_USERNAME=driver_user
DB_PASSWORD='your_password'

CACHE_STORE=redis
CACHE_DRIVER=redis
REDIS_CLIENT=predis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

---

## Dataset
- **Source:** Synthetic telematics data (generated via `generate_data.py`)
- **Rows:** 500 trip records
- **Drivers:** 20 drivers (D001–D020)
- **Date range:** Jan 1 – Mar 31, 2025
- **Raw columns:** `trip_distance, trip_duration, speed, braking_events, harsh_turns`
- **Engineered columns:** `delays_minutes, behavioral_problems, violations_count, accidents_count, rating`

---

## Metabase Dashboard
- URL: `http://localhost:3001`
- Public link: `http://localhost:3001/public/dashboard/7d726135-b929-49e6-9f0d-6ba2d6584108`

---
