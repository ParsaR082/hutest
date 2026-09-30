# Humazd Backend (Django + DRF)

## Quick Start (Local — SQLite, no Docker)

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements\development.txt
python manage.py migrate
python manage.py seed_all
python manage.py runserver 0.0.0.0:8000
```

## With Docker (PostgreSQL + Redis)

```powershell
# From repo root
docker compose up -d postgres redis

# Set in backend/.env
USE_SQLITE=False
POSTGRES_HOST=localhost

cd backend
python manage.py migrate
python manage.py seed_all
python manage.py runserver
```

## API

| URL | Description |
|-----|-------------|
| http://localhost:8000/api/v1/health/ | Health check |
| http://localhost:8000/api/v1/menu/ | Menu list |
| http://localhost:8000/api/docs/ | Swagger UI |
| http://localhost:8000/admin/ | Django admin |

## Seed Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@humazd.com | Admin123!@# |
| Demo Customer (VIP) | alex.chen@humazd.com | Demo123!@# |

## Project Structure

```
backend/
├── apps/
│   ├── accounts/      # User, JWT auth
│   ├── menu/          # MenuItem, dish details
│   ├── orders/        # Cart, Order, Payment
│   ├── reservations/  # Table, Reservation
│   ├── cms/           # SiteSettings, Testimonials
│   ├── loyalty/       # Loyalty points
│   ├── notifications/ # In-app notifications
│   └── core/          # Permissions, responses, audit
├── config/            # Django settings, URLs, ASGI
└── manage.py
```
