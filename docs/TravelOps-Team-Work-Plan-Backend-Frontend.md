# TravelOps — تقسیم کار اجرایی Backend + Frontend

> نسخه‌ی کوتاه برای شروع کار تیم ۳ نفره  
> مبنا: Backend docs + `Landing.html` + `Components.dc.html` + `Phase1..6.dc.html`

---

## 1. هدف

این سند فقط چیزهایی را مشخص می‌کند که تیم برای شروع لازم دارد:

- Scope نسخه‌ی اول
- Owner هر بخش
- صفحه‌های Frontend
- APIهای اصلی
- ترتیب اجرا
- قواعد Git/PR
- اختلاف‌هایی که بین Backend و Wireframeها باید از الان حل شوند

اصل کار:

> هر Feature یک Owner دارد، اما هیچ‌کس فقط Frontend یا فقط Backend نیست.

---

## 2. فایل‌های Frontend چه هستند؟

فایل‌های ارسالی Design/Prototype هستند، نه Source Code نهایی.

- `Landing.html` → مرجع ظاهر Landing
- `Components.dc.html` → رفتار و ساختار Componentهای مشترک
- `Phase1` → Marketplace + Auth
- `Phase2` → Customer Booking
- `Phase3` → Agency Reservation + Tour
- `Phase4` → Dashboard + Customer + Resources
- `Phase5` → Payment + Reports + Settings + Profile + Admin
- `Phase6` → Tour Guide Portal

HTML وایرفریم‌ها مستقیم Copy/Paste نشود؛ فقط به‌عنوان Spec UI و رفتار استفاده شود.

اگر Stack فرانت هنوز قطعی نیست، پیشنهاد ساده:

```text
React + TypeScript + Vite
```

---

# 3. Scope پروژه

## P0 — حتماً برای Demo

### Marketplace
- Landing
- Tour list/search
- Tour detail
- Register
- Login

### Customer
- Booking passengers
- Booking review
- My reservations
- Reservation detail
- Mock online payment

### Agency
- Reservation queue
- Reservation detail
- Tour list
- Create/Edit/Publish Tour
- Destination / Hotel / Transportation / TourGuide CRUD لازم

### Backend
- JWT
- Organization / Membership
- Permissions
- Tenant Isolation
- Tour lifecycle
- Reservation workflow
- Payment
- Capacity transaction
- Overbooking prevention
- OpenAPI
- Tests

## P1 — بعد از Flow اصلی
- Agency dashboard
- Customers
- Customer profile
- Organization settings
- Members
- Payments page
- Simple reports
- Public destinations
- UI polish

## P2 — فقط اگر وقت ماند
- Platform Admin کامل
- Guide Portal
- Card-to-card/manual payment
- Review/Rating
- Saved passengers
- Notifications
- Forgot password
- Cancellation penalty
- Excel/CSV/PDF export
- Real Email/SMS
- Support messaging
- Advanced reports

---

# 4. تصمیم‌های مهم بعد از بررسی Frontend

## 4.1 Reservation چند مسافر دارد

Wireframe رزرو چند Passenger برای یک Reservation دارد.

پس اضافه شود:

```text
Reservation
└── ReservationPassenger[]
```

حداقل:

```text
first_name
last_name
national_id
birth_date
passport_number?
phone?
is_lead
```

## 4.2 ظرفیت به تعداد مسافر کم می‌شود

```text
seats = reservation.passengers.count()
```

Payment موفق:

```text
atomic transaction
→ lock Tour/Capacity
→ check remaining >= seats
→ remaining -= seats
→ Reservation = PAID
```

مثال:

```text
Remaining = 3
Reservation = 2 passengers
Payment → Remaining = 1
```

## 4.3 قبل از Payment ظرفیت رزرو نمی‌شود

قانون نهایی:

```text
PENDING
APPROVED
WAITING_FOR_PAYMENT
→ no capacity hold

PAID
→ capacity reserved
```

اگر بین Approval و Payment ظرفیت پر شد، Payment Fail شود.

## 4.4 Status مشتری ساده‌تر نمایش داده می‌شود

Backend:

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

Customer:

```text
فاز 1 — ثبت و بررسی
PENDING / UNDER_REVIEW

فاز 2 — تأیید و پرداخت
APPROVED / WAITING_FOR_PAYMENT / PAID

فاز 3 — آماده سفر
CONFIRMED / READY_FOR_TRAVEL

فاز 4 — سفر
IN_PROGRESS / COMPLETED
```

Agency همان Status انگلیسی دقیق را می‌بیند.

## 4.5 Destination

برای Core همان ساختار Backend فعلی حفظ شود:

```text
Destination belongs to Organization
```

`/destinations` عمومی از Destinationهای Tourهای Published ساخته شود.

Global destination merging = P2.

## 4.6 Guide Portal

`TourGuide` فعلاً Resource آژانس است، نه User Role اصلی.

بنابراین `/guide...` تا پایان P0 اجرا نشود.

---

# 5. تقسیم کار نهایی

## عضو Parsa — Identity, Organization & Integration

### Backend
- Custom User
- Customer profile
- JWT
- Register/Login/Refresh
- Organization
- Membership
- Roles
- Permission architecture
- Tenant Isolation helpers
- Docker / env
- CI
- OpenAPI setup

### Frontend P0
- App bootstrap
- Router
- API client
- Auth state
- Protected routes
- `/register`
- `/login`
- shared header / agency shell
- `/me/reservations`
- `/me/reservations/[id]`

> داده‌ی Reservation از API عضو Ilya می‌آید؛ Parsa فقط Owner این UIهاست.

### Frontend P1
- `/me/profile`
- `/app`
- `/app/customers`
- `/app/customers/[id]`
- `/app/settings/organization`
- `/app/settings/members`
- `/app/reports`

### P2
- `/admin`

Reviewer: **Mani**

---

## عضو Mani — Marketplace, Tours & Resources

### Backend
- Destination
- Tour
- Tour status
- Itinerary
- Hotel
- Transportation
- TourGuide
- Search/filter
- Publish rules
- Public Tour APIs
- Tenant filtering منابع
- Tour tests

### Frontend P0
- `/`
- `/tours`
- `/tours/[id]`
- `/app/tours`
- `/app/tours/[id]`
- `/app/hotels`
- `/app/transportation`
- `/app/destinations`
- `/app/guides`

### P1
- `/destinations`

### P2
- `/guide`
- `/guide/[tourId]`
- `/guide/profile`

Reviewer: **Ilya**

---

## عضو Ilya — Booking, Reservation & Payment

### Backend
- Reservation
- ReservationPassenger
- StatusHistory
- Transition service
- Approve / Reject / Cancel
- Mock payment
- Capacity deduction by passenger count
- Transaction / locking
- Rollback
- Concurrency tests
- Overbooking prevention
- Travel lifecycle

### Frontend P0
- `/booking/[tourId]`
- `/booking/[tourId]/review`
- `/me/payment/[id]`
- payment success/failure
- `/app/reservations`
- `/app/reservations/[id]`

### P1
- `/app/payments`

Reviewer: **Parsa**

---

# 6. Screen Ownership

| Route | Owner | Priority |
|---|---|---|
| `/` | Mani | P0 |
| `/tours` | Mani | P0 |
| `/tours/[id]` | Mani | P0 |
| `/register` | Parsa | P0 |
| `/login` | Parsa | P0 |
| `/booking/[tourId]` | Ilya | P0 |
| `/booking/[tourId]/review` | Ilya | P0 |
| `/me/reservations` | Parsa | P0 |
| `/me/reservations/[id]` | Parsa | P0 |
| `/me/payment/[id]` | Ilya | P0 |
| `/app/reservations` | Ilya | P0 |
| `/app/reservations/[id]` | Ilya | P0 |
| `/app/tours` | Mani | P0 |
| `/app/tours/[id]` | Mani | P0 |
| `/app/hotels` | Mani | P0 |
| `/app/transportation` | Mani | P0 |
| `/app/destinations` | Mani | P0 |
| `/app/guides` | Mani | P0 |
| `/app` | Parsa | P1 |
| `/app/customers...` | Parsa | P1 |
| `/app/settings...` | Parsa | P1 |
| `/app/reports` | Parsa | P1 |
| `/app/payments` | Ilya | P1 |
| `/me/profile` | Parsa | P1 |
| `/destinations` | Mani | P1 |
| `/guide...` | Mani | P2 |
| `/admin` | Parsa | P2 |

---

# 7. Shared Frontend

Parsa زیرساخت اولیه را می‌سازد؛ بعد همه می‌توانند توسعه دهند.

```text
api/client
auth
router
Button
Input
Select
Modal
Table
Card
Pagination
LoadingState
EmptyState
ErrorState
StatusBadge
ConfirmDialog
AgencySidebar
```

قانون:

> چیزی Shared شود که واقعاً حداقل در دو Feature استفاده می‌شود.

---

# 8. قواعد UI مهم از Wireframeها

### Marketplace
- فقط `PUBLISHED` برای Customer
- Tour پرشده مخفی نشود؛ دکمه رزرو Disabled شود
- Agency name روی Tour مشخص باشد

### Customer
- Status انگلیسی نمایش داده نشود
- چهار فاز فارسی نمایش داده شود
- Loading / Empty / Error واقعی داشته باشد

### Agency
- Status دقیق Backend نمایش داده شود
- Reservation page یک Work Queue است
- UI جای Permission Backend را نمی‌گیرد

---

# 9. API Contract

Frontend Response را حدس نزند.

قبل از شروع UI وابسته، مشخص شود:

```text
Method
URL
Request
Response
Errors
Permission
```

مثال Booking:

```text
POST /reservations

{
  "tour_id": 12,
  "passengers": [
    {
      "first_name": "...",
      "last_name": "...",
      "national_id": "...",
      "birth_date": "..."
    }
  ]
}
```

Response:

```text
{
  "id": 55,
  "status": "PENDING",
  "passenger_count": 2
}
```

---

# 10. APIهای P0

## A

```text
POST /auth/register
POST /auth/login
POST /auth/refresh
GET  /auth/me

GET/POST /organizations
GET      /organizations/current
```

## B

```text
GET /tours
GET /tours/{id}
GET /destinations

GET/POST  /agency/tours
GET/PATCH /agency/tours/{id}
POST      /agency/tours/{id}/publish

CRUD /agency/destinations
CRUD /agency/hotels
CRUD /agency/transportation
CRUD /agency/guides
```

## C

```text
POST /reservations
GET  /me/reservations
GET  /me/reservations/{id}

GET  /agency/reservations
GET  /agency/reservations/{id}
POST /agency/reservations/{id}/transition

POST /reservations/{id}/pay
```

URL دقیق در OpenAPI نهایی شود.

برای DRF پیشنهاد:

```text
drf-spectacular + Swagger
```

---

# 11. ترتیب اجرا

## Iteration 0 — Foundation

**A**
- Backend/Frontend bootstrap
- JWT skeleton
- API client/router
- Docker/CI

**B**
- Tour models
- public Tour contract
- Marketplace skeleton

**C**
- Reservation state diagram
- Passenger model design
- Capacity test scenarios

Exit:

```text
Backend + Frontend + PostgreSQL + CI + Swagger run
```

## Iteration 1 — Auth + Browse

**A**
- Register/Login
- Roles
- Organization
- Protected routes

**B**
- Destination/Tour
- Published filtering
- Landing
- Tour list/detail

**C**
- Reservation/Passenger models
- Workflow پایه

Exit:

```text
Customer login → browse published tours
```

## Iteration 2 — Booking + Tour Management

**A**
- Permission/Tenant tests
- My Reservations UI skeleton

**B**
- Agency Tour list/edit
- Resources
- Publish

**C**
- Booking
- Review
- Create Reservation
- StatusHistory

Exit:

```text
Publish Tour
→ Customer creates Reservation
→ Capacity unchanged
```

## Iteration 3 — Approval + Payment

**A**
- My Reservations/detail
- Security review

**B**
- Tour integration/validation fixes

**C**
- Agency queue/detail
- Approve/Reject
- Mock payment
- Atomic capacity
- Overbooking tests

Exit:

```text
Reservation
→ Approve
→ Pay
→ Capacity -= passenger_count
```

## Iteration 4 — P1 + Release

اول:

1. Bugs
2. Integration
3. Dashboard/Customers/Profile
4. Settings/Members
5. Payments/Reports
6. Docs/Demo

P2 فقط بعد از سبز شدن Flow اصلی.

---

# 12. Demo اصلی

```text
Agency Login
→ Create Resources
→ Create Tour DRAFT
→ Publish

Customer Login
→ Search Tour
→ Tour Detail
→ Add Passengers
→ Create Reservation

Agency
→ Queue
→ Approve

Customer
→ Payment

Backend
→ lock capacity
→ verify seats
→ decrease capacity
→ PAID
```

بعد:

```text
Confirm
→ Travel
→ Complete
```

---

# 13. GitHub Workflow ریموت

Board:

```text
Backlog
Ready
In Progress
In Review
Blocked
Done
```

هر Issue:

```text
Owner
Reviewer
Priority
Dependency
Acceptance Criteria
```

Flow:

```text
Issue
→ Branch
→ Code + Test
→ Draft PR
→ CI
→ Review
→ Merge
```

Branch:

```text
feature/<issue>-<name>
fix/<issue>-<name>
test/<issue>-<name>
```

`main`:

- Direct push ممنوع
- PR الزامی
- حداقل ۱ Review
- CI باید سبز باشد

Review:

```text
Parsa → Mani
Mani → Ilya
Ilya → Parsa
```

Review تخصصی:

```text
Security/Tenant → Parsa
Tour contract → Mani
Reservation/Payment/Capacity → Ilya
```

---

# 14. Definition of Done

Backend:

- Permission
- Tenant filtering
- Tests
- OpenAPI
- CI
- Review

Frontend:

- API واقعی
- Loading
- Error
- Empty state در صورت نیاز
- Success state
- Review

Feature کامل:

```text
Backend + Frontend + Integration
```

---

# 15. تست‌های اجباری

### A
- Register/Login
- Role Permission
- Cross-tenant
- Customer only own data

### B
- DRAFT invisible
- PUBLISHED visible
- Cross-agency Tour access denied
- Search/filter
- Full Tour cannot be booked

### C
- Passenger validation
- PENDING does not reduce capacity
- Invalid transition rejected
- Payment failure keeps capacity
- Payment success reduces by passenger count
- Concurrent payment cannot overbook
- Rollback works

نکته:

> Object Permission برای List کافی نیست؛ QuerySet هم باید Tenant-filtered باشد.

---

# 16. Scope Gapهای Wireframe

این موارد طراحی شده‌اند اما Core نیستند:

### Card-to-card
Wireframe دارد، ولی Core فقط Mock Online Payment.

### Cancellation penalty
UI وجود دارد، Business Rule کامل Backend ندارد → P2.

### Review / Saved passengers / Notifications
→ P2.

### Guide Portal
نیازمند Guide User Role → P2.

### Platform Admin
یک Frame طراحی شده، ولی Core عملیاتی نیست → P2.

### Export
CSV/PDF/Excel → P2.

### Agency registration
Wireframe انتخاب نقش دارد ولی فرم Agency کامل نیست.

Core form ساده:

```text
name
email
phone
password
organization_name
```

### Payment countdown
فقط اگر Backend deadline واقعی دارد نمایش داده شود؛ Countdown جعلی نسازید.

---

# 17. چرا تقسیم کار عادلانه است؟

**A** بیشترین مسئولیت مشترک دارد:

```text
Auth + Security + Tenant + Infra + Integration
```

**B** بیشترین Entity و CRUD/UI دارد:

```text
Marketplace + Tours + Resources
```

**C** سخت‌ترین منطق را دارد:

```text
Workflow + Payment + Transaction + Concurrency
```

برای همین `/me/reservations` و Detail آن به A داده شده تا C بیش‌ازحد سنگین نشود.

اگر بعد از دو Iteration بار واقعی نامتعادل بود، فقط P1ها دوباره تقسیم شوند؛ Ownerهای P0 وسط کار بی‌دلیل جابه‌جا نشوند.

---

# 18. شروع کار

1. اسم واقعی افراد را جای A/B/C قرار دهید.
2. Frontend Stack را قطعی کنید.
3. `ReservationPassenger` را به ERD اضافه کنید.
4. Capacity-by-passenger را قفل کنید.
5. GitHub Board را بسازید.
6. Contract سه حوزه‌ی Auth / Tour / Reservation را مشخص کنید.
7. Issueهای Iteration 0 را بسازید.
8. P2ها را فقط در Backlog بگذارید.
9. Development را شروع کنید.

---

## منابع رسمی

- GitHub Pull Requests / CODEOWNERS / Protected branches  
  https://docs.github.com/en/pull-requests/reference/managing-and-standardizing-pull-requests

- DRF Permissions  
  https://www.django-rest-framework.org/api-guide/permissions/

- DRF OpenAPI  
  https://www.django-rest-framework.org/topics/documenting-your-api/

- Django `select_for_update`  
  https://docs.djangoproject.com/en/dev/ref/models/querysets/#select-for-update

- React + Vite + TypeScript starter  
  https://react.dev/learn/build-a-react-app-from-scratch

---

## خلاصه

```text
Parsa = Identity + Security + Organization + Integration
Mani = Marketplace + Tours + Resources
Ilya = Booking + Reservation + Payment + Capacity
```

```text
P0 → Integration → P1 → P2
```

هدف: اول یک Flow کامل، امن، تست‌شده و قابل Demo؛ بعد تکمیل همه‌ی Wireframeها.
