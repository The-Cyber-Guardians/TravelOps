# TravelOps - سند مرجع پروژه و برنامه اجرایی تیم

> وضعیت سند: مرجع رسمی و یگانه پروژه  
> تیم: Parsa، Mani، Ilya  
> دامنه: Backend + Frontend + Integration + Test + Delivery  
> آخرین بازنویسی: 2026-08-29

---

## 1. اعتبار و نحوه استفاده از این سند

این فایل تنها Source of Truth تیم برای Scope، تصمیم‌های فنی، قرارداد API، مالکیت Featureها، ترتیب اجرا و معیار تحویل است. تصمیمی که با این سند ناسازگار باشد تا زمانی که در همین فایل ثبت نشده، تصمیم پروژه محسوب نمی‌شود.

قواعد نگهداری سند:

1. تغییر Business Rule، API Contract، Scope یا Owner باید در همان Pull Request کد در این فایل نیز ثبت شود.
2. هر Task دقیقاً یک Owner دارد؛ همکاری دیگران مالکیت را تغییر نمی‌دهد.
3. هیچ Taskی بدون Acceptance Criteria، Reviewer و Test Owner وارد وضعیت `Ready` نمی‌شود.
4. تصمیم‌های جلسه هفتگی حداکثر تا پایان همان روز در بخش Decision Log ثبت می‌شوند.
5. اگر کد و سند ناسازگار باشند، Task بسته نیست؛ یا کد باید اصلاح شود یا تغییر سند Review و Merge شود.
6. واژه «Packet» در این سند یک بسته فنی قابل تحویل است و الزاماً برابر یک هفته تقویمی نیست.
7. واژه «Frame» به طرح Wireframe و واژه «Route» به مسیر برنامه اشاره دارد؛ تعداد آن‌ها لزوماً برابر نیست.

ترتیب اولویت اجرا:

```text
P0 Core Flow -> Integration and Security -> P1 Release -> P2 Optional
```

---

## 2. معرفی پروژه

TravelOps یک پلتفرم چندآژانسی برای مدیریت تور و چرخه کامل رزرو و سفر است. هر آژانس با یک `Organization` نمایش داده می‌شود و داده‌های مدیریتی آن از آژانس‌های دیگر جدا است. مشتری در سطح پلتفرم ثبت‌نام می‌کند، تورهای منتشرشده همه آژانس‌ها را می‌بیند و فقط به رزروهای خودش دسترسی دارد.

هدف پروژه ساخت یک سیستم کوچک ولی واقعی و قابل ارائه است که فقط CRUD نباشد و این مفاهیم را به‌صورت عملی نشان دهد:

- Authentication با JWT
- Role-Based Authorization
- Multi-Tenancy و Tenant Isolation
- REST API و OpenAPI
- Reservation State Machine
- Database Transaction و Rollback
- Capacity Management و جلوگیری از Overbooking
- Mock Payment
- Frontend یکپارچه با API واقعی
- Automated Tests، CI و Docker

### 2.1 معیار موفقیت اصلی

این مسیر باید بدون تغییر دستی Database قابل اجرا باشد:

```text
Agency registers and logs in
-> creates Destination, Hotel, Transportation and TourGuide
-> creates a DRAFT Tour and Itinerary
-> publishes the Tour

Customer registers and logs in
-> browses published Tours
-> adds one or more Passengers
-> creates a PENDING Reservation

Agency reviews and approves the Reservation
-> Reservation waits for payment

Customer makes a successful Mock Payment
-> capacity is atomically reduced by passenger count
-> Reservation becomes PAID

Agency advances the trip
-> CONFIRMED
-> READY_FOR_TRAVEL
-> IN_PROGRESS
-> COMPLETED
```

علاوه بر مسیر موفق، Tenant Isolation، Permission، Payment failure، Rollback و پرداخت هم‌زمان باید با تست ثابت شوند.

---

## 3. Scope و اولویت‌ها

### 3.1 P0 - الزامی برای Demo اصلی

Marketplace:

- Landing page
- Tour list، search و filter
- Tour detail
- Customer/Agency registration
- Login و token refresh

Customer:

- ثبت چند Passenger در یک Reservation
- Booking review
- My Reservations و Reservation detail
- Mock online payment
- نمایش فارسی و ساده‌شده وضعیت سفر

Agency:

- Reservation work queue و detail
- Transition رزرو
- Tour list و Tour editor
- Create، Edit و Publish تور
- CRUD مقصد، هتل، حمل‌ونقل و راهنما

Backend و Quality:

- Custom User، JWT، Organization و Membership
- Role permissions و Tenant Isolation
- Tour lifecycle
- Reservation workflow و status history
- Transactional capacity update
- Overbooking prevention
- OpenAPI، tests، Docker و CI

### 3.2 P1 - الزامی برای Release پس از پایداری Core Flow

- Agency dashboard
- Customer list و customer detail برای آژانس
- Organization settings
- Member management
- Customer profile
- Payments list
- Simple reports
- Public destinations
- UI polish و integration hardening
- Cancellation رزرو پرداخت‌شده و آزادسازی ظرفیت

### 3.3 P2 - اختیاری و غیرمسدودکننده Release

- Guide Portal
- Platform Admin console
- Card-to-card/manual payment
- Review و Rating
- Saved passengers
- Notifications
- Forgot password
- Cancellation penalty
- CSV، Excel و PDF export
- Email و SMS واقعی
- Support messaging
- Advanced reports
- Redis، Celery، Audit Log و Idempotency

Guide Portal و Platform Admin فقط پس از سبز بودن تمام P0 و P1 فعال می‌شوند و ناقص بودن آن‌ها مانع Release اصلی نیست.

### 3.4 خارج از Scope

- Real payment gateway
- Mobile application
- Direct flight/hotel booking
- GDS integration
- Full CRM یا accounting
- Microservices
- Kubernetes
- AI و dynamic pricing
- Production-scale async architecture

---

## 4. تصمیم‌های قفل‌شده

| ID | تصمیم نهایی |
|---|---|
| D1 | پروژه Full-stack است و Backend، Frontend، Integration و Tests با هم تحویل می‌شوند. |
| D2 | Customer یک User قابل Login در سطح Platform است، نه عضو یک Organization خاص. |
| D3 | ثبت‌نام Agency یک Organization و Membership مدیریتی می‌سازد. |
| D4 | `Tour.status` شامل `DRAFT`، `PUBLISHED` و `CLOSED` است. |
| D5 | فقط تور `PUBLISHED` در Marketplace عمومی دیده می‌شود؛ `DRAFT` فقط برای آژانس مالک است. |
| D6 | هر Reservation یک یا چند `ReservationPassenger` دارد. |
| D7 | ظرفیت هنگام ساخت یا Approval رزرو نگه داشته نمی‌شود؛ فقط پرداخت موفق ظرفیت را مصرف می‌کند. |
| D8 | ظرفیت به تعداد Passengerها کم می‌شود، نه به تعداد Reservationها. |
| D9 | Payment و کاهش ظرفیت در یک Transaction و با قفل ردیف Tour انجام می‌شوند. |
| D10 | Reservation به Customer و Tour متصل است و Organization آن از Organization مالک Tour تعیین می‌شود. |
| D11 | مقصدهای Core متعلق به Organization هستند؛ لیست عمومی از مقصد تورهای Published ساخته می‌شود. |
| D12 | Customer نام Statusهای داخلی انگلیسی را نمی‌بیند؛ Agency وضعیت دقیق را می‌بیند. |
| D13 | Payment countdown فقط در صورت وجود deadline واقعی Backend نمایش داده می‌شود. |
| D14 | UI هیچ‌گاه جای Permission و Tenant filter سمت Backend را نمی‌گیرد. |
| D15 | Guide در Core یک Resource آژانس است؛ اتصال آن به User فقط در P2 انجام می‌شود. |

---

## 5. فناوری و ساختار پروژه

### 5.1 Backend

```text
Python 3.9+
Django 4.2
Django REST Framework
PostgreSQL
Simple JWT
drf-spectacular
pytest + pytest-django
Ruff
Docker / Docker Compose
GitHub Actions
```

اپ‌های اصلی:

```text
accounts       Custom User, registration, JWT, profile
organizations Organization, Membership, roles, tenant utilities
tours          Destination, Hotel, Transportation, TourGuide, Tour, Itinerary
reservations   Customer, Passenger, Reservation, Payment, workflow, capacity
reports        Dashboard and simple reports when P1 starts
common         Only utilities genuinely shared by multiple apps
```

### 5.2 Frontend

```text
React 19
TypeScript
Vite
React Router
Vazirmatn from @fontsource/vazirmatn
RTL at the application root
```

اصول Frontend:

- فایل‌های Prototype فقط مرجع ظاهر و رفتار هستند و Source Code نهایی نیستند.
- مرجع نهایی Route `/` فایل Landing prototype است.
- Component فقط زمانی Shared می‌شود که حداقل در دو Feature استفاده واقعی داشته باشد.
- API response حدس زده نمی‌شود؛ UI وابسته فقط پس از قفل شدن Contract شروع می‌شود.
- هر صفحه Loading، Error، Success و در صورت نیاز Empty state دارد.
- طراحی باید روی Desktop و Mobile قابل استفاده باشد، حتی اگر Wireframe اولیه Desktop باشد.

### 5.3 مسیرهای Repository

نام پوشه‌های واقعی باید در Docker، CI و Documentation یکسان و از نظر حروف بزرگ و کوچک صحیح باشند. نام جاری Repository `Back-end/` و `Front-end/` است؛ استفاده از `backend/` یا `frontend/` بدون Rename رسمی مجاز نیست.

---

## 6. نقش‌ها و دسترسی‌ها

| نقش | محدوده | دسترسی اصلی |
|---|---|---|
| Platform Admin | Platform | مدیریت Organizationها؛ فقط P2 |
| Organization Admin | یک Organization | اعضا، منابع، تور، رزرو، پرداخت و تنظیمات |
| Organization Staff | یک Organization | منابع، تور و رزرو طبق Permission؛ بدون عملیات مدیریتی حساس |
| Customer | Platform | مشاهده تور عمومی، رزرو، پرداخت و مشاهده داده‌های خودش |
| Guide | Tourهای اختصاص‌یافته | فقط P2؛ مشاهده itinerary و passengerهای مجاز |

قواعد امنیتی غیرقابل مذاکره:

1. List endpoint باید QuerySet را Tenant-filter کند؛ Object Permission به‌تنهایی کافی نیست.
2. شناسه Object آژانس دیگر باید نتیجه‌ای بدون افشای وجود Object برگرداند، ترجیحاً `404`.
3. Customer فقط Reservation، Payment و profile خودش را می‌بیند.
4. منابع متصل به یک Tour باید همگی متعلق به Organization همان Tour باشند.
5. Public serializer از Agency serializer جدا است و فیلد داخلی را افشا نمی‌کند.
6. Publish فقط برای Organization Admin مجاز است.
7. Transition رزرو فقط برای کارمند مجاز آژانس صاحب Tour اجرا می‌شود؛ Payment فقط برای Customer مالک رزرو است.

---

## 7. مدل داده

موجودیت‌های Core:

```text
User
Organization
Membership
Customer
Destination
Hotel
Transportation
TourGuide
Tour
ItineraryItem
Reservation
ReservationPassenger
ReservationStatusHistory
Payment
```

روابط اصلی:

```text
User 1---0..1 Customer
User 1---* Membership *---1 Organization

Organization 1---* Destination
Organization 1---* Hotel
Organization 1---* Transportation
Organization 1---* TourGuide
Organization 1---* Tour

Tour *---1 Destination
Tour 1---* ItineraryItem
Tour *---* Hotel
Tour *---* Transportation
Tour *---* TourGuide

Customer 1---* Reservation *---1 Tour
Reservation 1---* ReservationPassenger
Reservation 1---* ReservationStatusHistory
Reservation 1---* Payment
```

### 7.1 حداقل فیلدهای Passenger

```text
first_name
last_name
national_id
birth_date
passport_number?   required only by relevant tour rules
phone?
is_lead
```

هر Reservation باید حداقل یک Passenger و دقیقاً یک Lead Passenger داشته باشد. Validation مربوط به National ID، Passport و تاریخ تولد باید در Contract مشخص و تست شود.

### 7.2 Tour و ظرفیت

Tour حداقل این مفاهیم را دارد:

```text
organization
destination
title
description
start_date
end_date
price
capacity
status
published_at?
```

`remaining_capacity` مقدار فقط‌خواندنی است. پیاده‌سازی می‌تواند آن را از ظرفیت مصرف‌شده محاسبه یا با شمارنده سازگار نگهداری کند، اما عملیات پرداخت و لغو باید اتمیک و تست‌شده باشد.

---

## 8. Workflow رزرو

### 8.1 وضعیت‌ها

۹ وضعیت مسیر اصلی:

```text
PENDING
UNDER_REVIEW
APPROVED
WAITING_FOR_PAYMENT
PAID
CONFIRMED
READY_FOR_TRAVEL
IN_PROGRESS
COMPLETED
```

سه وضعیت استثنا و نهایی:

```text
REJECTED
CANCELLED
PAYMENT_EXPIRED
```

### 8.2 Transitionهای الزامی

| مبدا | مقصد | Actor | اثر ظرفیت |
|---|---|---|---|
| PENDING | UNDER_REVIEW | Agency Staff/Admin | ندارد |
| PENDING | REJECTED | Agency Staff/Admin | ندارد |
| PENDING | CANCELLED | Customer مالک | ندارد |
| UNDER_REVIEW | APPROVED | Agency Staff/Admin | ندارد |
| UNDER_REVIEW | REJECTED | Agency Staff/Admin | ندارد |
| APPROVED | WAITING_FOR_PAYMENT | Agency Staff/Admin | ندارد |
| WAITING_FOR_PAYMENT | PAID | Customer از طریق Payment service | به تعداد Passenger کم می‌شود |
| WAITING_FOR_PAYMENT | PAYMENT_EXPIRED | System lazy check | ندارد |
| WAITING_FOR_PAYMENT | CANCELLED | Customer یا Agency مجاز | ندارد |
| PAID | CONFIRMED | Agency Staff/Admin | ندارد |
| PAID | CANCELLED | Agency Admin طبق Rule لغو | ظرفیت آزاد می‌شود |
| CONFIRMED | READY_FOR_TRAVEL | Agency Staff/Admin | ندارد |
| CONFIRMED | CANCELLED | Agency Admin طبق Rule لغو | ظرفیت آزاد می‌شود |
| READY_FOR_TRAVEL | IN_PROGRESS | Agency Staff/Admin | ندارد |
| IN_PROGRESS | COMPLETED | Agency Staff/Admin | ندارد |

Transition خارج از این جدول تا زمانی که با Decision ثبت نشده ممنوع است. هر Transition موفق یک `ReservationStatusHistory` با وضعیت قبلی، وضعیت جدید، Actor و timestamp می‌سازد.

### 8.3 نمایش وضعیت برای Customer

```text
فاز 1 - ثبت و بررسی
PENDING / UNDER_REVIEW

فاز 2 - تایید و پرداخت
APPROVED / WAITING_FOR_PAYMENT / PAID

فاز 3 - آماده سفر
CONFIRMED / READY_FOR_TRAVEL

فاز 4 - سفر
IN_PROGRESS / COMPLETED
```

برای `REJECTED`، `CANCELLED` و `PAYMENT_EXPIRED` پیام فارسی مستقل و روشن نمایش داده می‌شود. Agency نام دقیق Status و تاریخچه کامل را می‌بیند.

---

## 9. پرداخت و مدیریت ظرفیت

قانون اصلی:

```text
seats = reservation.passengers.count()
```

ساخت، بررسی یا Approval رزرو ظرفیت را نگه نمی‌دارد. هنگام پرداخت موفق:

```text
begin atomic transaction
-> lock Tour row with select_for_update
-> re-read Reservation and passenger count
-> verify Reservation belongs to paying Customer
-> verify status is WAITING_FOR_PAYMENT
-> apply lazy expiry check
-> verify remaining_capacity >= seats
-> create successful Payment exactly once
-> consume seats
-> transition Reservation to PAID
-> write StatusHistory
commit
```

در هر خطا تمام تغییرات Rollback می‌شوند. پرداخت ناموفق ظرفیت را تغییر نمی‌دهد. تکرار درخواست پرداخت نباید دو بار ظرفیت کم کند؛ حداقل باید وضعیت Reservation و وجود Payment موفق داخل همان Transaction کنترل شود.

مثال:

```text
Tour remaining capacity = 3
Reservation passenger count = 2
Successful payment -> remaining capacity = 1
```

اگر پس از Approval ظرفیت پر شود، Payment با خطای قابل فهم شکست می‌خورد. تور پرشده در Marketplace مخفی نمی‌شود، ولی دکمه Booking غیرفعال است.

لغو رزروی که ظرفیت مصرف کرده، دقیقاً یک بار و در Transaction ظرفیت را آزاد می‌کند. لغو رزروی که پرداخت نشده هیچ اثری روی ظرفیت ندارد.

---

## 10. API Contract

Prefix دقیق API باید در URL configuration و OpenAPI یکسان باشد. در این سند مسیرها بدون فرض Prefix سراسری نوشته شده‌اند.

قبل از شروع UI وابسته، Contract باید این موارد را مشخص کند:

```text
Method
URL
Authentication
Permission
Path and query parameters
Request body
Success response
Validation errors
Permission/not-found errors
Pagination
```

### 10.1 Endpointهای P0

Auth:

```text
POST /auth/register
POST /auth/login
POST /auth/refresh
GET  /auth/me
```

Marketplace:

```text
GET /tours
GET /tours/{id}
GET /destinations
```

Agency resources and tours:

```text
GET/POST          /agency/destinations
GET/PATCH/DELETE  /agency/destinations/{id}
GET/POST          /agency/hotels
GET/PATCH/DELETE  /agency/hotels/{id}
GET/POST          /agency/transportation
GET/PATCH/DELETE  /agency/transportation/{id}
GET/POST          /agency/guides
GET/PATCH/DELETE  /agency/guides/{id}

GET/POST          /agency/tours
GET/PATCH          /agency/tours/{id}
POST               /agency/tours/{id}/publish
```

Reservations and payment:

```text
POST /reservations
GET  /me/reservations
GET  /me/reservations/{id}
POST /reservations/{id}/pay

GET  /agency/reservations
GET  /agency/reservations/{id}
POST /agency/reservations/{id}/transition
```

### 10.2 Endpointهای P1

```text
GET/PATCH /organizations/current
GET/POST  /organizations/current/members
PATCH/DELETE /organizations/current/members/{id}
GET/PATCH /me/profile
GET       /agency/customers
GET       /agency/customers/{id}
GET       /agency/payments
GET       /agency/dashboard
GET       /agency/reports
```

### 10.3 نمونه Contract ساخت رزرو

```json
POST /reservations

{
  "tour_id": 12,
  "passengers": [
    {
      "first_name": "...",
      "last_name": "...",
      "national_id": "...",
      "birth_date": "2000-01-01",
      "is_lead": true
    }
  ]
}
```

پاسخ حداقل:

```json
{
  "id": 55,
  "status": "PENDING",
  "passenger_count": 1
}
```

---

## 11. Routeها و مالکیت نهایی Frontend

در Routeهای پارامتری، `[id]` فقط notation این سند است و پیاده‌سازی Router باید syntax واقعی کتابخانه را استفاده کند.

| Route | Owner | Priority | Packet |
|---|---|---|---|
| `/` | Mani | P0 | WP5 |
| `/tours` | Mani | P0 | WP5 |
| `/tours/[id]` | Mani | P0 | WP5 |
| `/destinations` | Mani | P1 | WP5 |
| `/register` | Parsa | P0 | WP2 |
| `/login` | Parsa | P0 | WP2 |
| `/booking/[tourId]` | Ilya | P0 | WP6 |
| `/booking/[tourId]/review` | Ilya | P0 | WP6 |
| `/me/reservations` | Ilya | P0 | WP6 |
| `/me/reservations/[id]` | Ilya | P0 | WP6 |
| `/me/payment/[id]` | Ilya | P0 | WP7 |
| `/me/profile` | Parsa | P1 | WP8 |
| `/app` | Parsa در skeleton؛ Ilya در integration نهایی | P1 | WP4/WP8 |
| `/app/reservations` | Ilya | P0 | WP7 |
| `/app/reservations/[id]` | Ilya | P0 | WP7 |
| `/app/tours` | Mani | P0 | WP4 |
| `/app/tours/[id]` | Mani | P0 | WP4 |
| `/app/destinations` | Mani | P0 | WP3 |
| `/app/hotels` | Mani | P0 | WP3 |
| `/app/transportation` | Mani | P0 | WP3 |
| `/app/guides` | Mani | P0 | WP3 |
| `/app/customers` | Ilya | P1 | WP8 |
| `/app/customers/[id]` | Ilya | P1 | WP8 |
| `/app/payments` | Ilya | P1 | WP7 |
| `/app/reports` | Ilya | P1 | WP8 |
| `/app/settings/organization` | Parsa | P1 | WP8 |
| `/app/settings/members` | Parsa | P1 | WP8 |
| `/guide` و زیرمسیرها | Mani | P2 | OP1 |
| `/admin` | Parsa | P2 | OP2 |

`/app` تنها Route با تحویل دومرحله‌ای است: Parsa پوسته و قرارداد widgetها را می‌سازد؛ Ilya داده و widgetهای نهایی را Integrate می‌کند. این تقسیم دو Owner هم‌زمان ایجاد نمی‌کند.

قواعد UI:

- Marketplace فقط `PUBLISHED` را نمایش می‌دهد و نام Agency روی Tour مشخص است.
- Customer هیچ Status انگلیسی داخلی نمی‌بیند.
- Agency Reservation page یک Work Queue است و وضعیت دقیق را نمایش می‌دهد.
- چهار صفحه منابع Agency از یک `ResourceListPage` قابل تنظیم استفاده می‌کنند.
- Shared components اولیه شامل `Button`، `Input`، `Select`، `Table`، `Card`، `Pagination`، `StatusBadge`، `Modal`، `ConfirmDialog`، `LoadingState`، `ErrorState` و `EmptyState` هستند.
- تعداد Frameهای طراحی جدا از تعداد Routeها در checklist UI ثبت می‌شود؛ یک Route ممکن است چند Frame یا state داشته باشد.

---

## 12. روش همکاری غیرهم‌زمان

### 12.1 وضعیت Taskها

```text
Backlog -> Ready -> In Progress -> In Review -> Done
                         |             |
                         +-> Blocked <-+
```

### 12.2 قالب اجباری هر Task

```text
Task ID:
Title:
Owner:
Reviewer:
Test Owner:
Priority:
Prerequisites:
Allowed area/files:
API contract or UI reference:
Deliverable:
Acceptance criteria:
Handoff notes:
Status:
```

### 12.3 قواعد استقلال اعضا

1. هر عضو فقط Taskهای `Ready` را شروع می‌کند.
2. Contractهای مشترک پیش از جدا شدن اعضا در جلسه هفتگی قفل می‌شوند.
3. اگر Dependency Merge نشده باشد، Task وابسته `Blocked` است؛ Mock contract فقط با توافق ثبت‌شده مجاز است.
4. هر Pull Request فقط یک Task یا مجموعه کوچک و منسجم را می‌بندد.
5. Handoff شامل migration، endpoint، نمونه payload، خطاهای شناخته‌شده و commandهای تست است.
6. Blocker همان روز در Board با علت، Owner رفع مانع و اثر آن روی Packet ثبت می‌شود.
7. تغییر فایل خارج از Allowed area بدون هماهنگی Owner آن حوزه مجاز نیست.

### 12.4 چرخه Review و Test

```text
Parsa reviews and tests Mani's work
Mani reviews and tests Ilya's work
Ilya reviews and tests Parsa's work
```

Review تخصصی ثانویه در صورت نیاز:

```text
Security and tenant isolation -> Parsa
Tour and marketplace contract -> Mani
Reservation, payment and concurrency -> Ilya
```

Reviewer تخصصی جای Reviewer اصلی را نمی‌گیرد مگر در Task صریحاً ثبت شود.

---

## 13. Work Packetهای اجرایی

### WP1 - پایه و زیرساخت

خروجی Packet:

```text
Docker Compose starts PostgreSQL, Backend and Frontend
Swagger opens
Frontend builds
CI runs lint and tests on every PR
```

| Task ID | Owner | Deliverable | Reviewer/Test Owner | Prerequisite |
|---|---|---|---|---|
| WP1-P-01 | Parsa | Django settings، PostgreSQL/env، ثبت appها، Swagger، Docker Compose و CI | Ilya | ندارد |
| WP1-P-02 | Parsa | تثبیت Vite/TypeScript، ESLint/Prettier، Vazirmatn، RTL و design tokens | Ilya | ندارد |
| WP1-M-01 | Mani | ثبت app `tours` و مرزبندی مسئولیت appها | Parsa | ندارد |
| WP1-M-02 | Mani | React Router، `MarketplaceLayout` و `ConsoleLayout` | Parsa | WP1-P-02 |
| WP1-I-01 | Ilya | app `reservations` و state map شامل هر ۱۲ وضعیت | Mani | ندارد |
| WP1-I-02 | Ilya | componentهای پایه و stateهای Loading/Error/Empty | Mani | WP1-P-02 |

Acceptance Criteria:

- commandهای نصب، build، lint و test در README یا PR handoff مشخص‌اند.
- `docker compose up` از مسیر مستندشده و با Case صحیح پوشه‌ها اجرا می‌شود.
- `/api/schema/` و Swagger UI پاسخ می‌دهند.
- Frontend build و Backend system check موفق‌اند.
- CI برای Backend و Frontend وجود دارد و سبز است.
- state map مسیر اصلی و مسیرهای استثنا را پوشش می‌دهد.

Handoff: Parsa آدرس سرویس‌ها و commandها را ثبت می‌کند؛ Mani route/layout contract و Ilya component API و transition map را تحویل می‌دهند.

### WP2 - هویت و Tenant Isolation

| Task ID | Owner | Deliverable | Reviewer/Test Owner | Prerequisite |
|---|---|---|---|---|
| WP2-P-01 | Parsa | Custom User، Organization، Membership، roleها و migration | Ilya | WP1-P-01 |
| WP2-P-02 | Parsa | Register/Login/Refresh/Me، Permissionها و `TenantQuerySetMixin` | Ilya | WP2-P-01 |
| WP2-P-03 | Parsa | Login/Register، API client، refresh interceptor و Protected Route | Ilya | WP1-M-02، Auth contract |
| WP2-M-01 | Mani | `Destination` به‌عنوان اولین مدل Tenant-scoped | Parsa | WP2-P-01 |
| WP2-M-02 | Mani | header/sidebar auth state و role redirect | Parsa | WP2-P-03 |
| WP2-I-01 | Ilya | `Customer` متصل به User و migration | Mani | WP2-P-01 |
| WP2-I-02 | Ilya | form validation مشترک و نگاشت خطای DRF به فارسی | Mani | WP2-P-03 |

Acceptance Criteria:

- Customer registration کاربر Platform می‌سازد.
- Agency registration، Organization و Admin Membership را اتمیک می‌سازد.
- Login، refresh و `/auth/me` تست شده‌اند.
- کارمند Agency A به Object و List آژانس B دسترسی ندارد.
- Redirect و Protected Route براساس نقش کار می‌کنند.

Handoff: migrationهای Parsa باید قبل از branchهای وابسته Merge شوند. OpenAPI Auth مرجع Frontend است.

### WP3 - منابع آژانس

| Task ID | Owner | Deliverable | Reviewer/Test Owner | Prerequisite |
|---|---|---|---|---|
| WP3-M-01 | Mani | مدل‌ها و migrationهای Hotel، Transportation، TourGuide و تکمیل Destination | Parsa | WP2-M-01 |
| WP3-M-02 | Mani | Serializer/ViewSet و CRUD چهار Resource با Organization filter | Parsa | WP3-M-01، Tenant mixin |
| WP3-M-03 | Mani | یک `ResourceListPage` و چهار route منابع | Parsa | WP1-I-02، API contract |
| WP3-P-01 | Parsa | Mixin نهایی Tenant و role permission روی Resourceها | Ilya | WP2-P-02، WP3-M-02 |
| WP3-P-02 | Parsa | ConfirmDialog حذف و Toast مشترک | Ilya | WP1-I-02 |
| WP3-I-01 | Ilya | مدل اولیه Reservation و ReservationPassenger بدون API | Mani | WP2-I-01 |
| WP3-I-02 | Ilya | Table با sorting، pagination سروری و stateهای کامل | Mani | WP1-I-02 |

Acceptance Criteria:

- CRUD هر چهار Resource برای Admin/Staff مجاز کار می‌کند.
- Customer و کارمند Organization دیگر رد می‌شوند.
- اتصال Resource بین دو Organization با Validation رد می‌شود.
- حذف در UI نیازمند Confirm است و نتیجه با Toast اعلام می‌شود.
- چهار صفحه کپی مستقل نیستند و از صفحه ژنریک استفاده می‌کنند.

### WP4 - تور و انتشار

| Task ID | Owner | Deliverable | Reviewer/Test Owner | Prerequisite |
|---|---|---|---|---|
| WP4-M-01 | Mani | Tour، ItineraryItem، relation منابع و migration | Parsa | WP3-M-01 |
| WP4-M-02 | Mani | Agency Tour API و validation انتشار | Parsa | WP4-M-01، WP3-P-01 |
| WP4-M-03 | Mani | Tour list/editor و Publish action | Parsa | API contract، WP3-I-02 |
| WP4-P-01 | Parsa | Tenant/Publish permissions و dashboard shell | Ilya | WP4-M-02 |
| WP4-I-01 | Ilya | ظرفیت، `remaining_capacity` و Tour/Reservation badges | Mani | WP4-M-01 |

Acceptance Criteria:

- Tour به‌صورت `DRAFT` ساخته می‌شود.
- Publish ناقص با validation errors مشخص رد می‌شود.
- فقط Organization Admin می‌تواند Publish کند.
- Draft برای Public و Agency دیگر نامرئی است.
- فیلد حساس Organization از request پذیرفته نمی‌شود.
- dashboard shell contract لازم برای WP8 را مستند می‌کند.

### WP5 - Marketplace عمومی

| Task ID | Owner | Deliverable | Reviewer/Test Owner | Prerequisite |
|---|---|---|---|---|
| WP5-M-01 | Mani | Public Tour list/detail، search/filter و public destinations | Parsa | WP4-M-02، WP4-I-01 |
| WP5-M-02 | Mani | Landing، Tour list/detail و Destinations pages | Parsa | Public API contract |
| WP5-P-01 | Parsa | Public serializer امن و endpointهای بدون token | Ilya | WP5-M-01 |
| WP5-P-02 | Parsa | `TourCard`، metadata و low-capacity state | Ilya | WP1-I-02 |
| WP5-I-01 | Ilya | `remaining_capacity` در contract و filter/query-string component | Mani | WP5-M-01 |

Acceptance Criteria:

- فقط Published در endpoint عمومی دیده می‌شود.
- Search/filter مقصد، تاریخ، قیمت و ظرفیت تست شده است.
- response عمومی هیچ فیلد مدیریتی داخلی ندارد.
- تور پرشده دیده می‌شود ولی قابل Booking نیست.
- Filter state با URL همگام و قابل share است.
- صفحات روی Mobile و Desktop قابل استفاده‌اند.

### WP6 - رزرو و Passengerها

| Task ID | Owner | Deliverable | Reviewer/Test Owner | Prerequisite |
|---|---|---|---|---|
| WP6-I-01 | Ilya | مدل‌های نهایی Reservation، Passenger و StatusHistory | Mani | WP3-I-01، WP1-I-01 |
| WP6-I-02 | Ilya | Transition service و Customer Reservation API | Mani | WP6-I-01 |
| WP6-I-03 | Ilya | Booking، Review، My Reservations و detail | Mani | WP6-I-02، WP5-P-02 |
| WP6-P-01 | Parsa | own-data permission و Organization derivation از Tour | Ilya | WP6-I-02 |
| WP6-P-02 | Parsa | Customer StatusTimeline چهارمرحله‌ای فارسی | Ilya | WP1-I-02 |
| WP6-M-01 | Mani | محافظت از تغییر قیمت/تاریخ/ظرفیت Tour دارای رزرو فعال | Parsa | WP6-I-01، WP4-M-02 |
| WP6-M-02 | Mani | Tour summary مشترک در Booking | Parsa | WP5-P-02 |

Acceptance Criteria:

- Reservation حداقل یک Passenger و دقیقاً یک Lead دارد.
- Tour باید Published و قابل رزرو باشد.
- Customer A رزرو Customer B را نمی‌بیند.
- Organization رزرو از request گرفته نمی‌شود و از Tour تعیین می‌شود.
- ساخت PENDING هیچ ظرفیتی کم یا hold نمی‌کند.
- Transition نامعتبر رد و Transition معتبر در History ثبت می‌شود.
- UI هیچ Status انگلیسی به Customer نشان نمی‌دهد.

### WP7 - بررسی، پرداخت و ظرفیت اتمیک

| Task ID | Owner | Deliverable | Reviewer/Test Owner | Prerequisite |
|---|---|---|---|---|
| WP7-I-01 | Ilya | Agency Reservation list/detail/transition APIs | Mani | WP6-I-02، WP6-P-01 |
| WP7-I-02 | Ilya | Payment model/service، lock، capacity update و rollback | Mani | WP7-I-01 |
| WP7-I-03 | Ilya | Agency queue/detail، Customer payment و Payments page | Mani | API contracts |
| WP7-P-01 | Parsa | Transition permissions و lazy `PAYMENT_EXPIRED` | Ilya | WP7-I-01 |
| WP7-P-02 | Parsa | Agency timeline و Confirm برای Approve/Reject | Ilya | WP7-I-03 |
| WP7-M-01 | Mani | realtime capacity integration و disabled booking | Parsa | WP7-I-02، WP5-M-01 |

Acceptance Criteria:

- فقط Agency مالک Transition را اجرا می‌کند.
- فقط Customer مالک می‌تواند پرداخت کند.
- Payment فقط از `WAITING_FOR_PAYMENT` پذیرفته می‌شود.
- پرداخت موفق ظرفیت را به تعداد Passenger کم می‌کند.
- پرداخت ناموفق و exception ظرفیت و Status را دست‌نخورده می‌گذارند.
- دو پرداخت هم‌زمان Overbook نمی‌کنند؛ تست concurrency روی PostgreSQL اجرا می‌شود.
- retry پرداخت موفق قبلی دوباره ظرفیت کم نمی‌کند.
- deadline منقضی به `PAYMENT_EXPIRED` می‌رود و ظرفیت مصرف نمی‌کند.

### WP8 - چرخه سفر و Release P1

| Task ID | Owner | Deliverable | Reviewer/Test Owner | Prerequisite |
|---|---|---|---|---|
| WP8-I-01 | Ilya | Transitionهای سفر، cancellation و release capacity | Mani | WP7-I-02 |
| WP8-I-02 | Ilya | Dashboard، Customers و Reports APIs/pages | Mani | WP4-P-01، Core integration |
| WP8-P-01 | Parsa | Organization settings و Member management | Ilya | WP2-P-02 |
| WP8-P-02 | Parsa | Customer profile و security/tenant audit | Ilya | Core APIs complete |
| WP8-M-01 | Mani | Marketplace/Tour integration hardening، demo data و OpenAPI consistency | Parsa | Core APIs complete |
| WP8-M-02 | Mani | Release smoke test و UI state/responsive audit | Parsa | تمام UIهای P0/P1 |

Acceptance Criteria:

- مسیر سفر تا `COMPLETED` کار می‌کند.
- لغو رزرو پرداخت‌شده دقیقاً یک بار ظرفیت را آزاد می‌کند.
- Dashboard و Report فقط داده Organization جاری را دارند.
- Member management role escalation غیرمجاز را رد می‌کند.
- Demo اصلی بدون admin/database edit اجرا می‌شود.
- OpenAPI با request/response واقعی سازگار است.
- تمام P0 و P1 انتخاب‌شده تست، Review و Handoff شده‌اند.
- CI سبز و Blocker باز Release وجود ندارد.

---

## 14. Packetهای اختیاری

### OP1 - Guide Portal

Owner: Mani  
Reviewer/Test Owner: Parsa  
Prerequisite: WP8 کامل

Deliverables:

- اتصال TourGuide به User و role راهنما
- endpointهای محدود به Tourهای اختصاص‌یافته
- `/guide`، `/guide/[tourId]` و `/guide/profile`
- تست اینکه Guide فقط Tour و Passengerهای مجاز خود را می‌بیند

### OP2 - Platform Admin

Owner: Parsa  
Reviewer/Test Owner: Ilya  
Prerequisite: WP8 کامل

Deliverables:

- Platform Admin role و permission مستقل
- Organization management API
- `/admin`
- تست جداسازی Platform Admin از Organization Admin

---

## 15. Definition of Ready

Task فقط زمانی `Ready` است که:

- Owner، Reviewer و Test Owner مشخص باشند.
- Priority و Packet مشخص باشند.
- Prerequisiteها Merge و روی branch مبنا قابل استفاده باشند.
- API Contract یا UI reference ثبت شده باشد.
- Acceptance Criteria قابل تست باشند.
- migration و داده موردنیاز مشخص باشند.
- Allowed area/files مشخص باشد.
- تصمیم Business حل‌نشده‌ای مانع کار نباشد.

---

## 16. Definition of Done

Backend Task:

- migration و validation صحیح دارد.
- Authentication، Permission و Tenant filtering اعمال شده‌اند.
- happy path و failure path تست شده‌اند.
- OpenAPI به‌روز است.
- lint و tests سبز هستند.
- Reviewer تایید کرده است.

Frontend Task:

- به API واقعی و Contract تاییدشده متصل است.
- Loading، Error، Success و Empty state مناسب دارد.
- Permission-sensitive action را درست نمایش می‌دهد ولی به UI متکی نیست.
- RTL، keyboard basics، Desktop و Mobile بررسی شده‌اند.
- lint و build سبز هستند.
- Reviewer تایید کرده است.

Feature فقط با این مجموعه Done است:

```text
Backend + Frontend + Integration + Tests + OpenAPI + Review + Handoff
```

وجود فایل یا scaffold به‌تنهایی به معنی Done نیست.

---

## 17. تست‌های اجباری Release

Auth و Security:

- Customer و Agency registration
- Login، refresh و `/auth/me`
- Role permissions
- Cross-tenant list و object access
- Customer own-data access
- Public endpoints بدون token

Tour و Marketplace:

- DRAFT برای Public و Agency دیگر نامرئی است.
- PUBLISHED عمومی است.
- Publish ناقص رد می‌شود.
- Resource متعلق به Organization دیگر قابل اتصال نیست.
- Search و filter درست کار می‌کنند.
- Full Tour دیده می‌شود ولی Booking آن غیرفعال است.
- Public serializer داده داخلی افشا نمی‌کند.

Reservation و Payment:

- Passenger validation
- PENDING ظرفیت را تغییر نمی‌دهد.
- Transition نامعتبر رد می‌شود.
- StatusHistory برای Transition معتبر ثبت می‌شود.
- Payment failure ظرفیت را تغییر نمی‌دهد.
- Payment success به تعداد Passenger ظرفیت کم می‌کند.
- Duplicate payment دوباره ظرفیت کم نمی‌کند.
- Concurrent payments Overbook نمی‌کنند.
- exception باعث Rollback کامل می‌شود.
- Paid cancellation ظرفیت را دقیقاً یک بار آزاد می‌کند.
- Customer و Agency غیرمالک به رزرو دسترسی ندارند.

Frontend و Integration:

- Auth expiry و refresh flow
- Loading/Error/Empty states
- Query-string filters
- فارسی بودن Customer status
- Agency transition confirmations
- Demo end-to-end
- Responsive smoke test

---

## 18. GitHub Workflow

Board columns:

```text
Backlog
Ready
In Progress
In Review
Blocked
Done
```

Branch naming:

```text
feature/<task-id>-<short-name>
fix/<task-id>-<short-name>
test/<task-id>-<short-name>
docs/<task-id>-<short-name>
```

Flow:

```text
Issue -> Branch -> Code and local tests -> Draft PR -> CI -> Review -> Merge
```

قواعد `main`:

- Direct push ممنوع است.
- Pull Request الزامی است.
- حداقل یک Review لازم است.
- CI باید سبز باشد.
- PR باید Task ID و Acceptance Criteria را reference کند.
- migration، OpenAPI change و breaking contract باید در PR description اعلام شوند.

### 18.1 Handoff اجباری PR

```text
What changed
How to run it
Migration or environment changes
API request/response examples
Tests executed
Known limitations
Next dependent task
```

---

## 19. جلسه هفتگی و کنترل پیشرفت

جلسه هفتگی فقط برای تصمیم و رفع هماهنگی است، نه گزارش شفاهی طولانی. ترتیب ثابت جلسه:

1. بررسی Demo خروجی Packetهای فعال
2. بررسی Taskهای Blocked و تعیین Owner رفع مانع
3. تایید یا رد Acceptance Criteria Taskهای In Review
4. قفل کردن Contractهای موردنیاز دوره بعد
5. انتقال Taskهای دارای Definition of Ready به `Ready`
6. ثبت تصمیم‌ها در Decision Log
7. مشخص کردن Demo و Handoff مورد انتظار جلسه بعد

هر عضو پیش از جلسه Board و PR خود را به‌روز می‌کند. چیزی که در Board، PR یا این سند ثبت نشده، قابل اتکا برای دو عضو دیگر نیست.

---

## 20. وضعیت مبنای Repository

این جدول نتیجه بررسی فایل‌ها در تاریخ سند است. `Pending verification` به معنی وجود پیاده‌سازی اولیه و نیاز به اجرای Acceptance Criteria است، نه Done.

| مورد | وضعیت مبنا | اقدام لازم |
|---|---|---|
| Django project و appهای اصلی | Implemented, pending verification | system check و test اجرا شود |
| PostgreSQL settings و env | Implemented, pending verification | اتصال واقعی Compose تست شود |
| DRF، CORS و drf-spectacular | Implemented, pending verification | schema generation تست شود |
| Swagger routes | Implemented, pending verification | smoke test اضافه شود |
| `accounts` و `organizations` scaffolds | Scaffold only | WP2 اجرا شود |
| `tours` scaffold | موجود ولی registration نیازمند بررسی | در `INSTALLED_APPS` و migration تایید شود |
| `reservations` scaffold | Implemented, pending verification | مدل‌ها و APIها هنوز WP6/WP7 هستند |
| ۹ status مسیر اصلی | Implemented, pending verification | سه status استثنا و transitionها اضافه شوند |
| React/Vite/TypeScript | Implemented, pending verification | lint و build اجرا شوند |
| Vazirmatn و design tokens | Implemented, pending verification | visual/RTL verification انجام شود |
| Router و Layoutها | Not verified/likely pending | WP1-M-02 |
| CI workflow | Not found | WP1-P-01 |
| Docker frontend path | ناسازگاری احتمالی Case/path | `Front-end` در برابر `frontend` اصلاح و تست شود |

هیچ Taskی فقط براساس این جدول بسته نمی‌شود؛ Owner باید تست و PR مرتبط را ارائه کند.

---

## 21. Release Checklist

Release اصلی زمانی مجاز است که:

- تمام Taskهای P0 در وضعیت Done باشند.
- P1های تعریف‌شده برای Release در وضعیت Done باشند.
- هیچ Blocker امنیتی، Tenant isolation یا data integrity باز نباشد.
- Demo اصلی از registration تا `COMPLETED` اجرا شود.
- تست concurrency روی PostgreSQL موفق باشد.
- migrationها از Database خالی اجرا شوند.
- OpenAPI بدون خطا تولید شود.
- Backend tests و lint سبز باشند.
- Frontend lint و build سبز باشند.
- Docker Compose با مسیرهای صحیح بالا بیاید.
- نمونه env فاقد Secret واقعی و کامل باشد.
- هر Feature Owner، Reviewer و Handoff ثبت‌شده داشته باشد.

OP1 و OP2 در این Checklist قرار ندارند.

---

## 22. Decision Log

| تاریخ | ID | تصمیم | دلیل/اثر |
|---|---|---|---|
| 2026-08-29 | DL-001 | این فایل جایگزین سه سند قبلی پوشه `docs/` شد. | حذف تناقض و ایجاد Source of Truth واحد |
| 2026-08-29 | DL-002 | Full-stack plan مرجع اجرا است. | Backend و Frontend هر دو در Repository شروع شده‌اند. |
| 2026-08-29 | DL-003 | Packetها مدت ثابت یک‌هفته‌ای ندارند. | وابستگی و حجم Featureها متفاوت است. |
| 2026-08-29 | DL-004 | Guide Portal و Platform Admin اختیاری هستند. | Core و P1 نباید توسط P2 مسدود شوند. |
| 2026-08-29 | DL-005 | Workflow شامل ۹ status اصلی و ۳ status استثنا است. | رفع تناقض «۹ وضعیت» با مسیرهای Reject/Cancel/Expiry |
| 2026-08-29 | DL-006 | تقسیم مرحله‌ای مبنای Screen Ownership شد. | جدول‌های قبلی درباره صفحات Reservation و Customer متناقض بودند. |

برای تصمیم جدید یک ردیف با تاریخ، ID یکتا، تصمیم و اثر آن اضافه شود؛ تصمیم‌های قدیمی حذف نمی‌شوند و در صورت تغییر با ردیف جدید supersede می‌شوند.

---

## 23. خلاصه مالکیت حوزه‌ها

```text
Parsa
Identity + Organization + Security + Tenant Isolation + Infrastructure

Mani
Marketplace + Tours + Agency Resources + Release Integration

Ilya
Customer + Reservation + Workflow + Payment + Capacity + Reports
```

این مالکیت به معنی کار انفرادی بدون Review نیست. مسیر ثابت کیفیت:

```text
Parsa -> reviews/tests Mani
Mani  -> reviews/tests Ilya
Ilya  -> reviews/tests Parsa
```

هدف نهایی تیم ابتدا یک Flow کامل، امن، تراکنشی، تست‌شده و قابل Demo است؛ سپس P1 تکمیل می‌شود و فقط در صورت زمان باقی‌مانده P2 آغاز خواهد شد.
