# Humazd Restaurant — Backend & Admin Panel Master Task Plan

> **هدف:** تکمیل بک‌اند و پنل ادمین بر اساس فرانت‌اند موجود، تا پروژه آماده Production شود.  
> **وضعیت فرانت:** UI/UX کامل — تمام منطق کسب‌وکار Mock است.  
> **Stack بک‌اند:** **Django 5 + Django REST Framework (DRF)**  
> **Stack فرانت:** Next.js 16 (موجود) — consumer of DRF API  
> **اولویت ویژه:** پنل ادمین حرفه‌ای در Next.js + API قدرتمند Django

---

## فهرست

1. [خلاصه بررسی فرانت‌اند](#1-خلاصه-بررسی-فرانتاند)
2. [معماری Django + DRF](#2-معماری-django--drf)
3. [مدل داده — Django Models](#3-مدل-داده--django-models)
4. [API Contract — DRF Endpoints](#4-api-contract--drf-endpoints)
5. [فازبندی پیاده‌سازی](#5-فازبندی-پیادهسازی)
6. [پنل ادمین — طراحی و ماژول‌ها (اولویت اصلی)](#6-پنل-ادمین--طراحی-و-ماژولها-اولویت-اصلی)
7. [اتصال Next.js به DRF API](#7-اتصال-nextjs-به-drf-api)
8. [Real-time & Notifications](#8-real-time--notifications)
9. [Production Readiness Checklist](#9-production-readiness-checklist)
10. [تست، امنیت، DevOps](#10-تست-امنیت-devops)
11. [وابستگی‌ها و Env Variables](#11-وابستگیها-و-env-variables)
12. [نکات فنی و بدهی‌های فرانت](#12-نکات-فنی-و-بدهیهای-فرانت)

---

## 1. خلاصه بررسی فرانت‌اند

### 1.1 Tech Stack

| لایه | تکنولوژی |
|------|----------|
| **Frontend** | Next.js 16.2.10, React 19, Tailwind CSS 4, Framer Motion |
| **Backend** | Django 5.x, DRF 3.15+, Python 3.12+ |
| **Database** | PostgreSQL 16 |
| **Cache/Queue** | Redis 7 |
| **Real-time** | Django Channels 4 + Redis channel layer |
| **Auth** | djangorestframework-simplejwt |
| **Media** | Django storages (S3/Cloudinary) |
| **Task Queue** | Celery + Redis (SMS, email, reports) |
| **زبان UI** | فارسی RTL — `#F97316` accent |

### 1.2 صفحات فرانت و وضعیت Backend

| Route | هدف | وضعیت فعلی |
|-------|-----|------------|
| `/` | Homepage | static `lib/data.ts` |
| `/menu` | لیست منو | `lib/menu-timeline-data.ts` |
| `/menu/[slug]` | جزئیات غذا | `lib/dishes-data.ts` — 4 slug |
| `/about` | درباره ما | inline constants |
| `/contact` | فرم تماس | mock submit |
| `/auth` | ورود/ثبت‌نام | Link به dashboard |
| `/dashboard` | داشبورد VIP | `MOCK_*` |
| `/admin/*` | پنل ادمین | **هنوز ساخته نشده** |

### 1.3 جریان‌های کاربری → DRF API

```
┌──────────────────────────────────────────────────────────────────┐
│              Next.js Frontend (localhost:3000)                    │
├──────────────────────────────────────────────────────────────────┤
│  Public Site                                                      │
│    BookingModal    → POST /api/v1/reservations/                  │
│    AuthPage        → POST /api/v1/auth/register/ | token/         │
│    Menu/DishDetail → GET  /api/v1/menu/ | /menu/{slug}/          │
│    Cart/Checkout   → POST /api/v1/cart/ → /orders/               │
│    ContactPage     → POST /api/v1/contact/                         │
│    Newsletter      → POST /api/v1/newsletter/                      │
├──────────────────────────────────────────────────────────────────┤
│  Customer Dashboard (/dashboard)                                  │
│    Profile         → GET/PATCH /api/v1/users/me/                 │
│    Active Orders   → GET /api/v1/orders/active/ + WebSocket      │
│    History         → GET /api/v1/orders/?status=delivered         │
│    Reservations    → CRUD /api/v1/reservations/                  │
├──────────────────────────────────────────────────────────────────┤
│  Admin Panel (/admin/*) — Next.js UI                             │
│    All modules     → /api/v1/admin/* (DRF ViewSets + permissions)│
└────────────────────────────┬─────────────────────────────────────┘
                             │ HTTP/JSON + JWT + WebSocket
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│              Django + DRF Backend (localhost:8000)                │
│  apps: accounts | menu | orders | reservations | cms | loyalty    │
│  PostgreSQL | Redis | Celery | Channels                          │
└──────────────────────────────────────────────────────────────────┘
```

### 1.4 مدل‌های داده فرانت (مرجع برای Django Models)

<details>
<summary>Dish, MenuItem, Booking, Dashboard models — click to expand</summary>

**TimelineMenuItem:** `{ id, slug, name, subtitle, description, price, image, category }`  
**DishDetail:** `{ slug, name, tasteProfile, hotspots[], processSteps[], pairings[], ... }`  
**Booking:** `{ partySize, date, time, fullName, phone, specialRequests }`  
**ActiveOrder:** `{ id, dishName, items[], statusIndex, estimatedMinutes, placedAt }`  
**ORDER_STATUS_STEPS:** `["ثبت سفارش", "در آشپزخانه", "در مسیر", "تحویل شد"]`

</details>

### 1.5 مشکلات فرانت که Backend باید حل کند

- [ ] Slug collision — 7 menu item → 4 detail page
- [ ] Popular dishes ≠ Menu items — unify via `is_featured` flag
- [ ] Opening hours conflict — single source in CMS
- [ ] Broken nav anchors — `/#gallery`, `/#blog`
- [ ] No cart/checkout — wire to DRF
- [ ] Dashboard tabs stubbed — implement with API
- [ ] No route protection — JWT middleware in Next.js
- [ ] حذف `lib/dishes.ts` (duplicate unused)

---

## 2. معماری Django + DRF

### 2.1 Monorepo Structure

```
humazd/                          # repo root
├── frontend/                    # Next.js (move existing files OR keep at root)
│   ├── app/
│   ├── components/
│   │   └── admin/               # Admin panel UI (NEW)
│   ├── lib/
│   │   └── api/                 # DRF client, types, hooks (NEW)
│   └── package.json
├── backend/                     # Django project (NEW)
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py              # Channels
│   ├── apps/
│   │   ├── accounts/            # User, auth, roles
│   │   ├── menu/                # MenuItem, categories, pairings
│   │   ├── orders/              # Order, Cart, Payment
│   │   ├── reservations/        # Reservation, Table
│   │   ├── cms/                 # SiteSettings, Testimonials, Blog
│   │   ├── loyalty/             # VIP tiers, points
│   │   ├── notifications/       # In-app, email, SMS
│   │   └── core/                # AuditLog, utilities, permissions
│   ├── requirements/
│   │   ├── base.txt
│   │   ├── development.txt
│   │   └── production.txt
│   ├── manage.py
│   └── pytest.ini
├── docker-compose.yml             # postgres, redis, backend, celery, frontend
├── .env.example
└── BACKEND_TASKS.md
```

> **نکته:** فعلاً فایل‌های Next.js در root هستند. در Phase 0 می‌توان `frontend/` ساخت یا root را نگه داشت — هر دو معتبر است.

### 2.2 Django Apps Breakdown

| App | مسئولیت | Models |
|-----|---------|--------|
| `accounts` | User, auth, roles, profile | User, Address |
| `menu` | منو و غذا | MenuItem, DishHotspot, DishProcessStep, DishGalleryImage, DishPairing |
| `orders` | سفارش، سبد، پرداخت | Order, OrderItem, OrderStatusHistory, Cart, CartItem, Payment |
| `reservations` | رزرو میز | Reservation, Table |
| `cms` | محتوا | SiteSettings, OpeningHour, Testimonial, BlogPost, ContactSubmission, NewsletterSubscriber |
| `loyalty` | VIP | LoyaltyTransaction, MembershipTierConfig |
| `notifications` | اعلان | Notification |
| `core` | مشترک | AuditLog, TimeStampedModel, Base permissions |

### 2.3 Auth Strategy (JWT)

| Role | Django Group | DRF Permission | Frontend Route |
|------|-------------|----------------|----------------|
| `CUSTOMER` | `customers` | `IsAuthenticated` | `/dashboard/*` |
| `STAFF` | `staff` | `IsStaff` | `/admin/kitchen`, `/admin/orders` |
| `MANAGER` | `managers` | `IsManager` | `/admin/*` (limited) |
| `ADMIN` | `admins` | `IsAdminUser` | `/admin/*` |
| `SUPER_ADMIN` | `super_admins` | `IsSuperAdmin` | `/admin/settings` |

**Packages:**
- `djangorestframework-simplejwt` — access (15min) + refresh (7 days) tokens
- `dj-rest-auth` (optional) — register/login endpoints
- Custom `User` model extending `AbstractUser` with `role` + `tier` fields

**Flow:**
```
Register → POST /api/v1/auth/register/ → create User (role=CUSTOMER)
Login    → POST /api/v1/auth/token/ → { access, refresh }
Refresh  → POST /api/v1/auth/token/refresh/
Logout   → POST /api/v1/auth/logout/ → blacklist refresh token
Me       → GET  /api/v1/users/me/ (Authorization: Bearer <access>)
```

### 2.4 DRF Architecture Patterns

```
Request → URL Router → ViewSet/APIView
         → Authentication (JWTAuthentication)
         → Permission (RoleBasedPermission)
         → Throttle (AnonRateThrottle / UserRateThrottle)
         → Serializer (validation)
         → Service Layer (business logic)
         → Model / QuerySet
         → Response (standard envelope)
```

**Standard Response Envelope:**
```python
# success
{"success": True, "data": {...}, "meta": {"page": 1, "total": 100}}

# error
{"success": False, "error": {"code": "VALIDATION_ERROR", "message": "...", "details": {...}}}
```

**Custom Exception Handler:** `core.exceptions.custom_exception_handler`

### 2.5 Key Django Packages

```txt
# requirements/base.txt
Django>=5.1,<5.2
djangorestframework>=3.15
djangorestframework-simplejwt>=5.3
django-cors-headers>=4.3
django-filter>=24.0
drf-spectacular>=0.27          # OpenAPI/Swagger docs
django-storages[s3]>=1.14      # media upload
Pillow>=10.0
celery>=5.4
redis>=5.0
django-redis>=5.4              # cache
channels>=4.1
channels-redis>=4.2
django-celery-beat>=2.6          # scheduled tasks
django-celery-results>=2.5
python-decouple>=3.8
gunicorn>=22.0
psycopg[binary]>=3.2
```

---

## 3. مدل داده — Django Models

### 3.1 accounts/models.py

```python
class User(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER = "customer"
        STAFF = "staff"
        MANAGER = "manager"
        ADMIN = "admin"
        SUPER_ADMIN = "super_admin"

    class Tier(models.TextChoices):
        STANDARD = "standard"
        SILVER = "silver"
        GOLD = "gold"
        VIP = "vip"

    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)
    tier = models.CharField(max_length=20, choices=Tier.choices, default=Tier.STANDARD)
    phone_verified = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        indexes = [models.Index(fields=["email"]), models.Index(fields=["role"])]
```

### 3.2 menu/models.py

```python
class MenuItem(TimeStampedModel):
    class Category(models.TextChoices):
        STARTERS = "starters"
        MAINS = "mains"
        DESSERTS = "desserts"
        DRINKS = "drinks"
        SPECIALS = "specials"

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200, blank=True)
    subtitle = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    long_description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=Category.choices)
    price = models.PositiveIntegerField()  # Toman

    image = models.ImageField(upload_to="menu/")
    plate_image = models.ImageField(upload_to="menu/", null=True, blank=True)
    anatomy_image = models.ImageField(upload_to="menu/", null=True, blank=True)
    process_image = models.ImageField(upload_to="menu/", null=True, blank=True)

    prep_time = models.CharField(max_length=50, blank=True)
    calories = models.CharField(max_length=50, blank=True)
    spicy_level = models.CharField(max_length=50, blank=True)
    allergens = models.CharField(max_length=200, blank=True)
    vegan = models.CharField(max_length=100, blank=True)

    taste_spiciness = models.PositiveSmallIntegerField(default=0)  # 0-100
    taste_sweetness = models.PositiveSmallIntegerField(default=0)
    taste_acidity = models.PositiveSmallIntegerField(default=0)
    taste_richness = models.PositiveSmallIntegerField(default=0)

    is_available = models.BooleanField(default=True)
    is_best_seller = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)

    pairings = models.ManyToManyField("self", through="DishPairing", symmetrical=False)

class DishHotspot(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="hotspots")
    top = models.CharField(max_length=10)   # "32%"
    left = models.CharField(max_length=10)  # "45%"
    name = models.CharField(max_length=100)
    description = models.TextField()
    sort_order = models.PositiveIntegerField(default=0)

class DishProcessStep(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="process_steps")
    step = models.CharField(max_length=10)
    title = models.CharField(max_length=200)
    description = models.TextField()
    sort_order = models.PositiveIntegerField(default=0)

class DishGalleryImage(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="gallery_images")
    image = models.ImageField(upload_to="menu/gallery/")
    alt = models.CharField(max_length=200)
    css_class = models.CharField(max_length=100, blank=True)
    hover_x = models.IntegerField(default=0)
    hover_y = models.IntegerField(default=0)
    sort_order = models.PositiveIntegerField(default=0)

class DishPairing(models.Model):
    main_dish = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="pairing_links")
    paired_dish = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="paired_by")
    class Meta:
        unique_together = [("main_dish", "paired_dish")]
```

### 3.3 orders/models.py

```python
class Order(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending"           # ثبت سفارش
        CONFIRMED = "confirmed"
        PREPARING = "preparing"         # در آشپزخانه
        READY = "ready"
        OUT_FOR_DELIVERY = "out_for_delivery"  # در مسیر
        DELIVERED = "delivered"         # تحویل شد
        CANCELLED = "cancelled"
        REFUNDED = "refunded"

    class Type(models.TextChoices):
        DINE_IN = "dine_in"
        TAKEAWAY = "takeaway"
        DELIVERY = "delivery"

    order_number = models.CharField(max_length=20, unique=True)  # ORD-7842
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    guest_name = models.CharField(max_length=200, blank=True)
    guest_phone = models.CharField(max_length=20, blank=True)
    guest_email = models.EmailField(blank=True)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    order_type = models.CharField(max_length=20, choices=Type.choices, default=Type.DINE_IN)
    subtotal = models.PositiveIntegerField()
    discount = models.PositiveIntegerField(default=0)
    tax = models.PositiveIntegerField(default=0)
    total = models.PositiveIntegerField()
    estimated_minutes = models.PositiveIntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)

    table = models.ForeignKey("reservations.Table", null=True, blank=True, on_delete=models.SET_NULL)
    reservation = models.ForeignKey("reservations.Reservation", null=True, blank=True, on_delete=models.SET_NULL)

    placed_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    prepared_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.TextField(blank=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    menu_item = models.ForeignKey(MenuItem, on_delete=models.PROTECT)
    name = models.CharField(max_length=200)  # snapshot
    unit_price = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField()
    notes = models.TextField(blank=True)

class OrderStatusHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="status_history")
    status = models.CharField(max_length=20, choices=Order.Status.choices)
    note = models.TextField(blank=True)
    changed_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

class Cart(TimeStampedModel):
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE)
    session_key = models.CharField(max_length=40, null=True, blank=True, unique=True)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    notes = models.TextField(blank=True)
    class Meta:
        unique_together = [("cart", "menu_item")]

class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending"
        COMPLETED = "completed"
        FAILED = "failed"
        REFUNDED = "refunded"
    class Method(models.TextChoices):
        CASH = "cash"
        CARD = "card"
        ONLINE = "online"
        WALLET = "wallet"

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    amount = models.PositiveIntegerField()
    method = models.CharField(max_length=20, choices=Method.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    transaction_id = models.CharField(max_length=100, blank=True)
    gateway_ref = models.CharField(max_length=100, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
```

### 3.4 reservations/models.py

```python
class Table(models.Model):
    label = models.CharField(max_length=100)  # "میز کنار پنجره ۴"
    capacity = models.PositiveIntegerField()
    zone = models.CharField(max_length=50, blank=True)  # VIP, Terrace, Main
    is_active = models.BooleanField(default=True)

class Reservation(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending"
        CONFIRMED = "confirmed"
        SEATED = "seated"
        COMPLETED = "completed"
        CANCELLED = "cancelled"
        NO_SHOW = "no_show"

    reservation_code = models.CharField(max_length=20, unique=True)  # RES-3291
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    guest_name = models.CharField(max_length=200)
    guest_phone = models.CharField(max_length=20)
    guest_email = models.EmailField(blank=True)
    date = models.DateField()
    time = models.TimeField()
    party_size = models.PositiveIntegerField()
    special_requests = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    table = models.ForeignKey(Table, null=True, blank=True, on_delete=models.SET_NULL)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.TextField(blank=True)
```

### 3.5 cms/models.py + core/models.py

```python
# cms
class SiteSettings(models.Model):
    restaurant_name = models.CharField(max_length=100, default="Humazd")
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField()
    lat = models.FloatField()
    lng = models.FloatField()
    social_instagram = models.URLField(blank=True)
    social_twitter = models.URLField(blank=True)
    social_facebook = models.URLField(blank=True)
    social_youtube = models.URLField(blank=True)

class OpeningHour(models.Model):
    days = models.CharField(max_length=100)
    open_time = models.TimeField()
    close_time = models.TimeField()
    sort_order = models.PositiveIntegerField(default=0)

class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100, blank=True)
    content = models.TextField()
    avatar = models.ImageField(upload_to="testimonials/", null=True, blank=True)
    rating = models.PositiveSmallIntegerField(default=5)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

class ContactSubmission(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    replied_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

# core
class AuditLog(models.Model):
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=50)
    entity_id = models.CharField(max_length=50)
    metadata = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=200)
    body = models.TextField()
    notification_type = models.CharField(max_length=50)
    is_read = models.BooleanField(default=False)
    link = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

### 3.6 Seed Data Tasks

- [ ] **TASK-DB-001:** Management command `seed_menu` — migrate `lib/dishes-data.ts` + fix slugs
- [ ] **TASK-DB-002:** `seed_menu` — all 7 timeline items with unique slugs
- [ ] **TASK-DB-003:** Mark featured dishes from `popularDishes`
- [ ] **TASK-DB-004:** Seed 12-15 tables (Main/VIP/Terrace zones)
- [ ] **TASK-DB-005:** Create superuser + demo customer (MOCK_USER)
- [ ] **TASK-DB-006:** Seed SiteSettings from `contactInfo`
- [ ] **TASK-DB-007:** Seed OpeningHours (unified)
- [ ] **TASK-DB-008:** Seed testimonials from about page

---

## 4. API Contract — DRF Endpoints

> Base URL: `http://localhost:8000/api/v1/`  
> Docs: `http://localhost:8000/api/docs/` (drf-spectacular Swagger)

### 4.1 Public Endpoints (AllowAny)

| Method | Endpoint | ViewSet/View | توضیح |
|--------|----------|--------------|-------|
| GET | `/menu/` | `MenuItemViewSet.list` | `?category=starters` |
| GET | `/menu/featured/` | `MenuItemViewSet.featured` | homepage dishes |
| GET | `/menu/{slug}/` | `MenuItemViewSet.retrieve` | full dish detail |
| GET | `/settings/public/` | `PublicSettingsView` | contact, hours, social |
| GET | `/testimonials/` | `TestimonialViewSet.list` | active testimonials |
| POST | `/reservations/` | `ReservationCreateView` | guest booking |
| GET | `/reservations/availability/` | `AvailabilityView` | `?date=&party_size=` |
| POST | `/contact/` | `ContactSubmissionView` | contact form |
| POST | `/newsletter/subscribe/` | `NewsletterSubscribeView` | email subscribe |
| POST | `/auth/register/` | `RegisterView` | customer signup |
| POST | `/auth/token/` | `TokenObtainPairView` | login → JWT |
| POST | `/auth/token/refresh/` | `TokenRefreshView` | refresh token |
| POST | `/auth/password/reset/` | `PasswordResetView` | forgot password |

### 4.2 Customer Endpoints (IsAuthenticated)

| Method | Endpoint | توضیح |
|--------|----------|-------|
| GET/PATCH | `/users/me/` | profile + tier + loyalty points |
| POST | `/users/me/avatar/` | upload avatar |
| GET | `/cart/` | current cart |
| POST | `/cart/items/` | add `{menu_item_id, quantity, notes?}` |
| PATCH | `/cart/items/{id}/` | update quantity |
| DELETE | `/cart/items/{id}/` | remove item |
| DELETE | `/cart/clear/` | empty cart |
| POST | `/orders/` | checkout → create order |
| GET | `/orders/` | list `?status=` |
| GET | `/orders/{id}/` | detail |
| GET | `/orders/active/` | current active order |
| POST | `/orders/{id}/reorder/` | clone order to cart |
| GET | `/reservations/` | user's reservations |
| GET | `/reservations/upcoming/` | next reservation |
| PATCH | `/reservations/{id}/` | modify (if pending) |
| DELETE | `/reservations/{id}/` | cancel |
| GET | `/notifications/` | list notifications |
| PATCH | `/notifications/{id}/read/` | mark read |

### 4.3 Admin Endpoints (Role-based)

| Method | Endpoint | Permission | توضیح |
|--------|----------|------------|-------|
| GET | `/admin/dashboard/stats/` | Manager+ | KPI cards data |
| GET | `/admin/dashboard/charts/` | Manager+ | revenue, orders charts |
| CRUD | `/admin/menu/` | Manager+ | MenuItem ViewSet + nested |
| POST | `/admin/menu/reorder/` | Manager+ | bulk sort_order update |
| CRUD | `/admin/orders/` | Staff+ | order management |
| PATCH | `/admin/orders/{id}/status/` | Staff+ | `{status, note?, estimated_minutes?}` |
| POST | `/admin/orders/manual/` | Manager+ | walk-in order |
| CRUD | `/admin/reservations/` | Manager+ | reservation management |
| PATCH | `/admin/reservations/{id}/assign-table/` | Manager+ | table assignment |
| CRUD | `/admin/tables/` | Manager+ | table CRUD |
| GET | `/admin/customers/` | Manager+ | customer list + search |
| GET | `/admin/customers/{id}/` | Manager+ | full CRM profile |
| PATCH | `/admin/customers/{id}/tier/` | Admin+ | change VIP tier |
| CRUD | `/admin/staff/` | Admin+ | staff accounts |
| CRUD | `/admin/testimonials/` | Manager+ | CMS testimonials |
| CRUD | `/admin/blog/` | Manager+ | blog posts |
| GET/PATCH | `/admin/settings/` | SuperAdmin | site settings |
| GET | `/admin/contacts/` | Manager+ | contact inbox |
| PATCH | `/admin/contacts/{id}/read/` | Manager+ | mark read |
| GET | `/admin/newsletter/` | Manager+ | subscribers export |
| GET | `/admin/audit-logs/` | Admin+ | audit trail |
| POST | `/admin/media/upload/` | Manager+ | image upload |
| GET | `/admin/reports/sales/` | Manager+ | `?from=&to=&format=csv` |
| GET | `/admin/reports/menu-performance/` | Manager+ | best sellers |
| GET | `/admin/reports/reservations/` | Manager+ | booking analytics |

### 4.4 WebSocket Endpoints (Channels)

| Path | Consumer | توضیح |
|------|----------|-------|
| `ws/orders/{order_id}/` | `OrderStatusConsumer` | customer live tracker |
| `ws/admin/events/` | `AdminEventConsumer` | admin live feed |
| `ws/kitchen/` | `KitchenConsumer` | KDS real-time board |

### 4.5 DRF Serializers (Key)

```python
# menu/serializers.py
MenuItemListSerializer       # list view — lightweight
MenuItemDetailSerializer     # full detail + nested hotspots, steps, gallery, pairings
MenuItemAdminSerializer      # admin CRUD — writable nested

# orders/serializers.py
CartSerializer, CartItemSerializer
OrderCreateSerializer        # checkout validation
OrderDetailSerializer        # customer view
OrderAdminSerializer         # admin view + status history
OrderStatusUpdateSerializer  # PATCH status

# reservations/serializers.py
ReservationCreateSerializer  # public booking
ReservationDetailSerializer
AvailabilityQuerySerializer

# accounts/serializers.py
UserProfileSerializer
RegisterSerializer
StaffCreateSerializer
```

---

## 5. فازبندی پیاده‌سازی

### Phase 0 — Django Foundation (هفته 1)

- [ ] **TASK-P0-001:** `django-admin startproject config` in `backend/`
- [ ] **TASK-P0-002:** Create all apps: accounts, menu, orders, reservations, cms, loyalty, notifications, core
- [ ] **TASK-P0-003:** Custom User model + first migration (`AUTH_USER_MODEL`)
- [ ] **TASK-P0-004:** DRF setup: JWT, CORS, pagination, exception handler, spectacular
- [ ] **TASK-P0-005:** Role-based permissions in `core/permissions.py`
- [ ] **TASK-P0-006:** All models + migrations
- [ ] **TASK-P0-007:** `docker-compose.yml` — postgres, redis, backend
- [ ] **TASK-P0-008:** Management commands: `seed_all`, `createsuperuser` script
- [ ] **TASK-P0-009:** Celery + Redis setup (basic task)
- [ ] **TASK-P0-010:** Django Channels ASGI setup
- [ ] **TASK-P0-011:** `.env.example` + `requirements/` files
- [ ] **TASK-P0-012:** Health check: `GET /api/v1/health/`
- [ ] **TASK-P0-013:** Swagger docs at `/api/docs/`
- [ ] **TASK-P0-014:** Next.js API client setup in `lib/api/client.ts`

### Phase 1 — Menu & CMS API (هفته 2)

- [ ] **TASK-P1-001:** MenuItem model + all nested models
- [ ] **TASK-P1-002:** `MenuItemViewSet` — list, retrieve, filter by category
- [ ] **TASK-P1-003:** `featured` action + `PublicSettingsView`
- [ ] **TASK-P1-004:** Testimonial list endpoint
- [ ] **TASK-P1-005:** `seed_menu` command from frontend TS data
- [ ] **TASK-P1-006:** Admin `MenuItemAdminViewSet` — full CRUD
- [ ] **TASK-P1-007:** Media upload endpoint
- [ ] **TASK-P1-008:** Redis cache on menu list (5min TTL)
- [ ] **TASK-P1-009:** Refactor Next.js menu pages → fetch from DRF
- [ ] **TASK-P1-010:** Refactor homepage PopularDishes → `/menu/featured/`
- [ ] **TASK-P1-011:** Fix slug uniqueness in seed data
- [ ] **TASK-P1-012:** حذف `lib/dishes.ts`

### Phase 2 — Auth & Customer Dashboard (هفته 3)

- [ ] **TASK-P2-001:** RegisterView + validation (email, phone, password)
- [ ] **TASK-P2-002:** JWT login/refresh/logout + blacklist
- [ ] **TASK-P2-003:** Password reset flow (email token)
- [ ] **TASK-P2-004:** `UserProfileView` — GET/PATCH `/users/me/`
- [ ] **TASK-P2-005:** VIP tier auto-upgrade service (loyalty app)
- [ ] **TASK-P2-006:** Next.js `AuthProvider` + JWT storage (httpOnly cookie via Next.js proxy OR secure localStorage)
- [ ] **TASK-P2-007:** Refactor `AuthPage.tsx` — real API calls
- [ ] **TASK-P2-008:** Next.js middleware — protect `/dashboard/*`
- [ ] **TASK-P2-009:** Dashboard overview — wire to API
- [ ] **TASK-P2-010:** Dashboard tab: Active Orders — full
- [ ] **TASK-P2-011:** Dashboard tab: Order History — full
- [ ] **TASK-P2-012:** Dashboard tab: Reservations — full CRUD
- [ ] **TASK-P2-013:** Profile settings page `/dashboard/settings`

### Phase 3 — Cart, Orders & Booking (هفته 4)

- [ ] **TASK-P3-001:** Cart model + CartService (guest session + user merge on login)
- [ ] **TASK-P3-002:** Cart API endpoints
- [ ] **TASK-P3-003:** Next.js `CartProvider` + cart drawer UI
- [ ] **TASK-P3-004:** Wire DishDetail + PopularDishes add-to-cart
- [ ] **TASK-P3-005:** Checkout page `/checkout`
- [ ] **TASK-P3-006:** `OrderCreateSerializer` + checkout logic
- [ ] **TASK-P3-007:** Order number generator `ORD-{seq:04d}` (DB sequence)
- [ ] **TASK-P3-008:** ReservationCreateView + wire BookingModal
- [ ] **TASK-P3-009:** AvailabilityService — table conflict detection
- [ ] **TASK-P3-010:** Table auto-assignment algorithm
- [ ] **TASK-P3-011:** Celery task: send reservation SMS (Kavenegar) + email
- [ ] **TASK-P3-012:** ContactSubmissionView + wire ContactPage
- [ ] **TASK-P3-013:** NewsletterSubscribeView + wire About page
- [ ] **TASK-P3-014:** Reorder endpoint
- [ ] **TASK-P3-015:** Rate limiting on public POST endpoints

### Phase 4 — Real-time (هفته 5)

- [ ] **TASK-P4-001:** `OrderStatusConsumer` WebSocket
- [ ] **TASK-P4-002:** Signal: post_save Order → broadcast status change
- [ ] **TASK-P4-003:** Wire `ActiveOrderTracker` to WebSocket
- [ ] **TASK-P4-004:** `AdminEventConsumer` — live admin feed
- [ ] **TASK-P4-005:** `KitchenConsumer` — KDS board
- [ ] **TASK-P4-006:** Notification model + create on events
- [ ] **TASK-P4-007:** Celery: email notifications (django-anymail or SMTP)
- [ ] **TASK-P4-008:** Celery: SMS via Kavenegar
- [ ] **TASK-P4-009:** Celery Beat: reservation reminder 2h before

### Phase 5 — Admin Panel (هفته 6-8) ⭐ اولویت اصلی

> UI در Next.js (`/admin/*`) — تمام data از DRF Admin API

- [ ] **TASK-P5-001:** Admin layout shell — sidebar, header, breadcrumbs
- [ ] **TASK-P5-002:** Admin auth gate — JWT role check (Staff+)
- [ ] **TASK-P5-003:** Analytics Dashboard — KPI + charts (Recharts)
- [ ] **TASK-P5-004:** Menu Management — list + full tabbed editor
- [ ] **TASK-P5-005:** Order Management — list + detail + status controls
- [ ] **TASK-P5-006:** Kitchen Display System (KDS) — Kanban + WebSocket
- [ ] **TASK-P5-007:** Reservation Management — calendar + list + detail
- [ ] **TASK-P5-008:** Table Management CRUD
- [ ] **TASK-P5-009:** Customer CRM — list + profile + tier management
- [ ] **TASK-P5-010:** Content CMS — testimonials, blog, contacts inbox
- [ ] **TASK-P5-011:** Staff Management — CRUD + role assignment
- [ ] **TASK-P5-012:** Reports — sales, menu, reservations + CSV export
- [ ] **TASK-P5-013:** Settings page — restaurant info, booking rules, loyalty
- [ ] **TASK-P5-014:** Media Library — browse uploaded images
- [ ] **TASK-P5-015:** Audit Logs viewer
- [ ] **TASK-P5-016:** Notification Center — bell icon + unread count
- [ ] **TASK-P5-017:** Command Palette (Cmd+K) global search
- [ ] **TASK-P5-018:** Django Admin fallback — register models with `django-unfold` (optional internal tool)

### Phase 6 — Production (هفته 9-10)

- [ ] **TASK-P6-001:** Zarinpal payment gateway integration
- [ ] **TASK-P6-002:** S3/Cloudinary media in production
- [ ] **TASK-P6-003:** Email templates (HTML, Persian)
- [ ] **TASK-P6-004:** SEO — dynamic metadata from CMS API
- [ ] **TASK-P6-005:** Sentry (django + next.js)
- [ ] **TASK-P6-006:** Structured logging (structlog)
- [ ] **TASK-P6-007:** GitHub Actions CI — pytest + lint + build
- [ ] **TASK-P6-008:** Production Docker — Gunicorn + Daphne + Nginx
- [ ] **TASK-P6-009:** DB backup cron (pg_dump → S3)
- [ ] **TASK-P6-010:** django-redis cache tuning
- [ ] **TASK-P6-011:** Load test with locust
- [ ] **TASK-P6-012:** Security audit + OWASP checklist

---

## 6. پنل ادمین — طراحی و ماژول‌ها (اولویت اصلی)

> **معماری:** Next.js Admin UI → DRF Admin API → Django Models  
> **طراحی:** Dark theme (`#0a0a0a`, accent `#F97316`), RTL فارسی, data-dense

### 6.1 Admin Routes (Next.js)

```
/admin                          → Analytics Dashboard
/admin/orders                   → Order list
/admin/orders/[id]              → Order detail + status
/admin/kitchen                  → Kitchen Display System (KDS)
/admin/reservations             → Calendar + list
/admin/reservations/[id]        → Detail + assign table
/admin/menu                     → Menu list (drag-drop reorder)
/admin/menu/new                 → Create dish
/admin/menu/[id]/edit           → Tabbed editor (7 tabs)
/admin/tables                   → Table management
/admin/customers                → CRM list
/admin/customers/[id]           → Customer profile
/admin/content/testimonials     → Testimonials CRUD
/admin/content/blog             → Blog CRUD
/admin/content/contacts         → Contact inbox
/admin/staff                    → Staff management
/admin/reports                  → Reports & exports
/admin/media                    → Media library
/admin/notifications            → Notification center
/admin/audit-logs               → Audit trail
/admin/settings                 → System settings
```

### 6.2 Analytics Dashboard (`/admin`)

**DRF Backend:** `GET /api/v1/admin/dashboard/stats/` + `/charts/`

#### KPI Cards
| KPI | Django Query |
|-----|-------------|
| درآمد امروز | `Order.objects.filter(placed_at__date=today, status=DELIVERED).aggregate(Sum('total'))` |
| سفارش‌های امروز | `Order.objects.filter(placed_at__date=today).count()` |
| رزروهای امروز | `Reservation.objects.filter(date=today).count()` |
| میانگین سفارش | `Avg('total')` last 7 days |
| مشتریان جدید | `User.objects.filter(date_joined__date=today).count()` |
| نرخ اشغال میز | booked tables / active tables |

#### Charts (Recharts in Next.js, data from DRF)
- [ ] Revenue — last 7/30/90 days (DRF returns `[{date, revenue}]`)
- [ ] Orders by hour — heatmap data
- [ ] Top 10 dishes — `OrderItem.objects.values('name').annotate(count=Count('id'))`
- [ ] Category revenue pie
- [ ] Reservation weekly trend

#### Live Feed
- [ ] WebSocket `ws/admin/events/` — new orders, reservations, contacts
- [ ] Sound alert on new order (browser Audio API)
- [ ] Upcoming reservations next 2 hours

#### Quick Actions
- [ ] Manual order → `POST /admin/orders/manual/`
- [ ] Quick reservation modal
- [ ] Toggle daily special → `PATCH /admin/menu/{id}/` `is_featured`

---

### 6.3 Order Management

**DRF:** `OrderAdminViewSet` + `OrderStatusUpdateView`

#### List (`/admin/orders`)
- [ ] django-filter: status, date_range, order_type, payment_status
- [ ] Search: order_number, guest_name, guest_phone (DRF SearchFilter)
- [ ] Pagination: PageNumberPagination (25/50/100)
- [ ] Bulk status update action

#### Detail (`/admin/orders/[id]`)
- [ ] Full order + items + status history timeline
- [ ] One-click status buttons → `PATCH /admin/orders/{id}/status/`
- [ ] Internal notes field (staff-only)
- [ ] Cancel with reason → triggers refund Celery task if paid
- [ ] Print receipt (browser print CSS)

#### Kitchen Display (`/admin/kitchen`) ⭐
- [ ] Full-screen Kanban: PENDING | PREPARING | READY
- [ ] WebSocket `ws/kitchen/` — auto-update
- [ ] Order cards: number, items, notes, elapsed timer
- [ ] Tap to advance status
- [ ] Color urgency: >20min yellow, >30min red
- [ ] Sound on new order
- [ ] No sidebar — tablet optimized

---

### 6.4 Reservation Management

**DRF:** `ReservationAdminViewSet` + `TableViewSet` + `AvailabilityView`

- [ ] **Calendar view** — fetch `/admin/reservations/?date_from=&date_to=` → render in React calendar
- [ ] **Drag to reschedule** → PATCH with conflict validation in Django
- [ ] **Assign table** → `PATCH /admin/reservations/{id}/assign-table/`
- [ ] **Status workflow:** pending → confirmed → seated → completed / no_show
- [ ] **SMS reminder** — Celery Beat task + manual trigger button
- [ ] **Convert to order** — pre-fill cart from reservation

---

### 6.5 Menu Management ⭐

**DRF:** `MenuItemAdminViewSet` with writable nested serializers

#### List
- [ ] Grid/list toggle, drag-drop reorder → `POST /admin/menu/reorder/`
- [ ] Quick toggles: available, best_seller, featured
- [ ] Category filter tabs
- [ ] Bulk delete, bulk category change

#### Editor — 7 Tabs (maps to Django nested serializers)

| Tab | Fields | DRF Serializer |
|-----|--------|---------------|
| Basic Info | name, slug, category, descriptions, price | `MenuItemAdminSerializer` |
| Media | images, gallery, floating ingredients | nested `DishGalleryImageSerializer` |
| Nutrition | prep_time, calories, allergens, taste profile | taste_* fields |
| Hotspots | interactive anatomy markers | nested `DishHotspotSerializer` |
| Process | cooking steps | nested `DishProcessStepSerializer` |
| Pairings | related dishes | M2M through `DishPairing` |
| Settings | flags, SEO meta | `is_available`, `meta_title`, `meta_description` |

- [ ] **Hotspot visual editor** — click on anatomy image → POST hotspot coords
- [ ] **Taste profile radar** — live preview from sliders
- [ ] **Preview button** — opens `/menu/{slug}` in new tab

---

### 6.6 Customer CRM

**DRF:** `CustomerAdminViewSet` (User queryset filtered role=CUSTOMER)

- [ ] List with search, tier filter, export CSV (DRF CSV renderer)
- [ ] Profile page: stats aggregation in Django (`annotate(Sum('orders__total'))`)
- [ ] Tabs: orders, reservations, loyalty ledger, admin notes
- [ ] Actions: change tier, deactivate, send notification

---

### 6.7 Content, Staff, Reports, Settings

(همان محتوای قبلی — فقط data source = DRF Admin API)

**Staff:** `StaffAdminViewSet` — creates User with role STAFF/MANAGER/ADMIN  
**Reports:** Django ORM aggregations → DRF → CSV via `?format=csv`  
**Settings:** Singleton `SiteSettings` model — GET/PATCH `/admin/settings/`  
**AuditLog:** Django signal on admin actions → `AuditLog.objects.create(...)`

---

### 6.8 Admin UI Components (`components/admin/`)

- [ ] `AdminShell`, `AdminSidebar`, `AdminHeader`
- [ ] `DataTable` (TanStack Table + DRF pagination)
- [ ] `StatCard`, `StatusBadge`, `ConfirmDialog`
- [ ] `DateRangePicker`, `ImageUploader`, `RichTextEditor` (TipTap)
- [ ] `HotspotEditor`, `TasteProfileEditor`
- [ ] `OrderStatusStepper`, `CalendarView`, `KanbanBoard`
- [ ] `CommandPalette`, `NotificationBell`, `ExportButton`

**Design tokens:**
```css
--admin-bg: #0a0a0a;
--admin-surface: #111111;
--admin-border: #1f1f1f;
--admin-accent: #F97316;
```

---

### 6.9 Django Admin Fallback (Optional)

برای debugging و ops سریع:
- [ ] `django-unfold` — modern Django admin theme
- [ ] Register all models with inline editors
- [ ] Read-only production admin (SUPER_ADMIN only)
- [ ] Not customer-facing — internal tool only

---

## 7. اتصال Next.js به DRF API

### 7.1 API Client Setup

```typescript
// lib/api/client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export async function apiClient<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options?.token && { Authorization: `Bearer ${options.token}` }),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = await res.json();
  if (!json.success) throw new ApiError(json.error);
  return json.data;
}
```

### 7.2 Next.js Refactor Checklist

| File | Change |
|------|--------|
| `lib/api/` | **NEW** — client, types, hooks (React Query) |
| `lib/data.ts` | Keep types; fetch from `/settings/public/` |
| `lib/menu-timeline-data.ts` | Replace with API hook |
| `lib/dishes-data.ts` | Replace with API hook; keep TS types |
| `lib/dashboard-data.ts` | Replace MOCK_* with API hooks |
| `BookingModal.tsx` | Form state + `POST /reservations/` |
| `AuthPage.tsx` | Real login/register → JWT |
| `Dashboard.tsx` | React Query + all tabs |
| `DishDetail.tsx` | Add to cart → `/cart/items/` |
| `ContactPage.tsx` | `POST /contact/` |
| `middleware.ts` | **NEW** — JWT check for `/dashboard`, `/admin` |
| `next.config.ts` | Add `rewrites` proxy to Django (optional, dev CORS) |

### 7.3 New Frontend Features

- [ ] `CartProvider` + cart drawer
- [ ] `AuthProvider` — JWT refresh logic
- [ ] React Query (`@tanstack/react-query`) for all API calls
- [ ] Toast notifications (`sonner`)
- [ ] Loading skeletons
- [ ] `/checkout` page
- [ ] `/dashboard/settings` page
- [ ] WebSocket hook `useWebSocket(url)` for order tracking

### 7.4 CORS & Proxy

```python
# backend/config/settings/base.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://humazd.com",
]
CORS_ALLOW_CREDENTIALS = True
```

```typescript
// next.config.ts (optional dev proxy)
async rewrites() {
  return [{ source: "/api/v1/:path*", destination: "http://localhost:8000/api/v1/:path*" }];
}
```

---

## 8. Real-time & Notifications

### 8.1 Django Channels Setup

```python
# config/asgi.py
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
})

# orders/consumers.py
class OrderStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.order_id = self.scope["url_route"]["kwargs"]["order_id"]
        await self.channel_layer.group_add(f"order_{self.order_id}", self.channel_name)
        await self.accept()

    async def order_status_update(self, event):
        await self.send(text_data=json.dumps(event["data"]))
```

### 8.2 Django Signals → Broadcast

```python
@receiver(post_save, sender=Order)
def broadcast_order_status(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"order_{instance.id}",
        {"type": "order_status_update", "data": OrderDetailSerializer(instance).data}
    )
```

### 8.3 Celery Tasks

| Task | Trigger | Service |
|------|---------|---------|
| `send_reservation_sms` | reservation confirmed | Kavenegar API |
| `send_order_confirmation_email` | order placed | SMTP/Resend |
| `send_reservation_reminder` | Celery Beat 2h before | Kavenegar |
| `generate_weekly_report` | Celery Beat Monday 8am | Email to manager |
| `process_payment_webhook` | Zarinpal callback | Payment model update |

---

## 9. Production Readiness Checklist

### 9.1 Infrastructure

- [ ] PostgreSQL (managed: Neon/RDS/Supabase)
- [ ] Redis (Upstash/ElastiCache)
- [ ] Django on Gunicorn (HTTP) + Daphne (WebSocket)
- [ ] Next.js on Vercel
- [ ] Nginx reverse proxy — `/api/` → Django, `/` → Next.js
- [ ] S3/R2 for media (`django-storages`)
- [ ] CDN for static/media
- [ ] SSL (Let's Encrypt)

### 9.2 Django Security Settings

```python
# production.py
DEBUG = False
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
ALLOWED_HOSTS = ["api.humazd.com"]
```

- [ ] `django-axes` — brute force protection on login
- [ ] DRF throttling — anon: 100/hour, user: 1000/hour
- [ ] File upload validation (size, mime type)
- [ ] JWT blacklist on logout (`rest_framework_simplejwt.token_blacklist`)
- [ ] Input sanitization in rich text (bleach)

### 9.3 Performance

- [ ] `django-redis` cache — menu, settings
- [ ] `select_related` / `prefetch_related` on all list views
- [ ] Database indexes (defined in models Meta)
- [ ] DRF pagination on all list endpoints
- [ ] Celery for async tasks (never block request)

---

## 10. تست، امنیت، DevOps

### 10.1 Testing

| Layer | Tool | Target |
|-------|------|--------|
| Django unit | pytest-django | models, services, serializers — 80%+ |
| DRF integration | pytest + APIClient | all endpoints |
| Celery tasks | pytest-celery | notification tasks |
| Next.js unit | Vitest | api client, hooks |
| E2E | Playwright | full user flows |

### 10.2 Critical Test Scenarios

```python
# tests/test_orders.py
def test_checkout_creates_order_with_items()
def test_order_status_broadcasts_websocket()
def test_guest_cart_merges_on_login()

# tests/test_reservations.py
def test_availability_prevents_double_booking()
def test_table_auto_assignment()

# tests/test_permissions.py
def test_staff_cannot_access_settings()
def test_customer_cannot_access_admin_endpoints()
```

### 10.3 Docker Compose

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: flavoro
      POSTGRES_USER: flavoro
      POSTGRES_PASSWORD: flavoro
  redis:
    image: redis:7-alpine
  backend:
    build: ./backend
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000
    depends_on: [postgres, redis]
  celery:
    build: ./backend
    command: celery -A config worker -l info
    depends_on: [redis, postgres]
  celery-beat:
    build: ./backend
    command: celery -A config beat -l info
  frontend:
    build: .
    command: npm run dev
    ports: ["3000:3000"]
```

### 10.4 CI/CD (GitHub Actions)

```yaml
jobs:
  backend-test:
    runs-on: ubuntu-latest
    services:
      postgres: ...
    steps:
      - run: pytest --cov=apps --cov-report=xml
  frontend-test:
    steps:
      - run: npm run lint && npm run build
  deploy:
    needs: [backend-test, frontend-test]
    # deploy backend to VPS/Railway, frontend to Vercel
```

---

## 11. وابستگی‌ها و Env Variables

### 11.1 Backend — requirements/base.txt

```txt
Django>=5.1,<5.2
djangorestframework>=3.15
djangorestframework-simplejwt>=5.3
django-cors-headers>=4.3
django-filter>=24.0
drf-spectacular>=0.27
django-storages[s3]>=1.14
Pillow>=10.0
celery>=5.4
redis>=5.0
django-redis>=5.4
channels>=4.1
channels-redis>=4.2
django-celery-beat>=2.6
django-celery-results>=2.5
python-decouple>=3.8
gunicorn>=22.0
daphne>=4.1
psycopg[binary]>=3.2
django-axes>=6.5
bleach>=6.1
```

### 11.2 Frontend — additional packages

```json
{
  "@tanstack/react-query": "latest",
  "@tanstack/react-table": "latest",
  "recharts": "latest",
  "@tiptap/react": "latest",
  "react-dropzone": "latest",
  "sonner": "latest",
  "date-fns": "latest",
  "date-fns-jalali": "latest"
}
```

### 11.3 Environment Variables

```env
# ─── Django Backend (.env) ───
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://flavoro:flavoro@localhost:5432/flavoro
REDIS_URL=redis://localhost:6379/0
CORS_ALLOWED_ORIGINS=http://localhost:3000

# JWT
JWT_ACCESS_TOKEN_LIFETIME=15   # minutes
JWT_REFRESH_TOKEN_LIFETIME=7   # days

# Media
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=
AWS_S3_REGION_NAME=

# Email
EMAIL_HOST=smtp.resend.com
EMAIL_HOST_USER=resend
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL=hello@humazd.com

# SMS (Iran)
KAVENEGAR_API_KEY=
KAVENEGAR_SENDER=

# Payment
ZARINPAL_MERCHANT_ID=
ZARINPAL_SANDBOX=True

# Sentry
SENTRY_DSN=

# ─── Next.js Frontend (.env.local) ───
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ASSET_VERSION=1
```

---

## 12. نکات فنی و بدهی‌های فرانت

### 12.1 Pre-Production Fixes

1. Slug uniqueness — Django `SlugField(unique=True)` enforces this
2. Nav links `/#gallery`, `/#blog` — implement or remove
3. Opening hours — single `OpeningHour` model
4. Social links — from `SiteSettings` API
5. AuthPage — real JWT login
6. ContactPage lint error — fix JSX comment
7. Dashboard tabs — wire to DRF

### 12.2 API Response Standard

```python
# core/responses.py
class APIResponse:
    @staticmethod
    def success(data, meta=None, status=200):
        return Response({"success": True, "data": data, "meta": meta}, status=status)

    @staticmethod
    def error(code, message, details=None, status=400):
        return Response({"success": False, "error": {"code": code, "message": message, "details": details}}, status=status)
```

### 12.3 Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| API URLs | kebab-case, trailing slash | `/api/v1/menu-items/` |
| Django models | PascalCase | `MenuItem`, `OrderStatusHistory` |
| DB tables | snake_case | `menu_menuitem` |
| Order numbers | `ORD-{seq:04d}` | ORD-7842 |
| Reservation codes | `RES-{seq:04d}` | RES-3291 |
| Prices | Integer Toman | `1900000` |
| Dates (UI) | Jalali via `django-jalali` or frontend `date-fns-jalali` | ۲۴ مرداد ۱۴۰۵ |

---

## Quick Start — Django Backend

```bash
# 1. Create backend directory
mkdir backend && cd backend

# 2. Python venv
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements/development.txt

# 3. Start infrastructure
cd .. && docker compose up -d postgres redis

# 4. Django setup
cd backend
python manage.py migrate
python manage.py seed_all
python manage.py createsuperuser

# 5. Run Django
python manage.py runserver 0.0.0.0:8000

# 6. Run Celery (new terminal)
celery -A config worker -l info
celery -A config beat -l info

# 7. Run Next.js (new terminal)
cd .. && npm run dev

# 8. Open
# Frontend: http://localhost:3000
# Django Admin: http://localhost:8000/admin/
# API Docs: http://localhost:8000/api/docs/
```

---

## Progress Tracker

| Phase | Status | Tasks Done | Total |
|-------|--------|------------|-------|
| Phase 0 — Django Foundation | ⬜ Not Started | 0 | 14 |
| Phase 1 — Menu & CMS API | ⬜ Not Started | 0 | 12 |
| Phase 2 — Auth & Dashboard | ⬜ Not Started | 0 | 13 |
| Phase 3 — Cart & Orders | ⬜ Not Started | 0 | 15 |
| Phase 4 — Real-time | ⬜ Not Started | 0 | 9 |
| Phase 5 — Admin Panel | ⬜ Not Started | 0 | 18 |
| Phase 6 — Production | ⬜ Not Started | 0 | 12 |
| **TOTAL** | | **0** | **93** |

---

*Last updated: 2026-08-02*  
*Stack: Django 5 + DRF + Next.js 16*  
*Generated from frontend audit of DejaVueResturant / Humazd codebase*
