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

# 5. تقسیم کار نهایی — هشت مرحله

## 5.0 قواعد این بخش

**واژه‌نامه.** در این سند «مرحله» یعنی بازه‌ی کاری تیم (۱ تا ۸). «فاز» فقط به گروه‌های صفحه در فایل‌های وایرفریم اشاره دارد (`Phase1..6.dc.html`). این دو را با هم اشتباه نگیرید.

**قاعده‌ی تست چرخشی.** هیچ‌کس تست کد خودش را نمی‌نویسد:

```text
پارسا  →  تست‌های مانی
مانی   →  تست‌های ایلیا
ایلیا  →  تست‌های پارسا
```

همان زنجیره‌ی Review بخش ۱۳ است. هدف: هر سه نفر مجبور شوند API و کد همدیگر را واقعاً بخوانند.

**قاعده‌ی حضور.** هیچ مرحله‌ای بدون کار برای هر سه نفر بسته نمی‌شود.

**مرجع صفحه.** هر Route زیر، به یک فریم مشخص در وایرفریم گره خورده است. شماره‌ی فریم داخل پرانتز آمده. اگر فریم نداشت، صریح نوشته شده.

**تصمیم‌های ثابت فرانت:**

```text
همه‌ی ۳۴ فریم فقط دسکتاپ ۱۴۴۰ هستند
فونت Vazirmatn از npm (@fontsource/vazirmatn) — بدون CDN
dir="rtl" روی سطح ریشه
مرجع نهایی صفحه‌ی / فایل Landing.html است، نه فریم ۱-۱
```

---

## مرحله ۱ — پایه و زیرساخت

**خروجی مرحله:** `docker compose up` بالا می‌آید، DRF جواب می‌دهد، Swagger باز می‌شود، فرانت خالی build می‌شود، CI روی هر PR سبز می‌شود.

### پارسا
- **Backend** — تکمیل `config/settings.py`: افزودن `rest_framework`، `drf_spectacular`، `corsheaders`، اپ‌های خودی به `INSTALLED_APPS`؛ اتصال PostgreSQL؛ env با `python-dotenv`؛ مسیر Swagger در `config/urls.py`؛ تکمیل `docker-compose.yml`؛ ساخت `.github/workflows/ci.yml` با ruff + pytest
- **Frontend** — bootstrap پروژه `frontend/` با React + TypeScript + Vite؛ ساختار پوشه؛ ESLint/Prettier؛ نصب `@fontsource/vazirmatn`؛ استخراج توکن‌های رنگ و تایپوگرافی از `Components.dc.html` به `tokens.css`
- **Tests** — تست‌های مانی

### مانی
- **Backend** — ساخت اپ `tours` (فقط `startapp` + ثبت)؛ ثبت تصمیم ساختار اپ‌ها در سند
- **Frontend** — Router با React Router؛ دو Layout پوسته: `MarketplaceLayout` (کامپوننت ۱ هدر + ۲ فوتر) و `ConsoleLayout` (کامپوننت ۳ سایدبار راست + ۴ نوار بالایی)
- **Tests** — تست‌های ایلیا

### ایلیا
- **Backend** — ساخت اپ `reservations` (خالی)؛ ماژول `states.py` فقط شامل ثابت نُه وضعیت و نقشه‌ی Transition معتبر
- **Frontend** — کامپوننت‌های پایه از `Components.dc.html`: `Button` `Input` `Select` `Table` `Card` `Pagination` `StatusBadge` `EmptyState` `LoadingState` `ErrorState` `Modal` `ConfirmDialog`
- **Tests** — تست‌های پارسا (smoke: بالا آمدن `/api/schema/`)

**وابستگی:** ندارد. سه شاخه‌ی کاملاً موازی.

---

## مرحله ۲ — هویت و ایزوله‌سازی

**خروجی مرحله:** مشتری و آژانس ثبت‌نام می‌کنند، با JWT وارد می‌شوند، و کارمند آژانس A به هیچ داده‌ی آژانس B نمی‌رسد.

### پارسا
- **Backend** — `User` سفارشی، `Organization`، `Membership`، نقش‌ها؛ ثبت‌نام دومسیره (مشتری / آژانس)؛ `POST /auth/register` `/auth/login` `/auth/refresh` و `GET /auth/me`؛ کلاس‌های Permission؛ `TenantQuerySetMixin`
- **Frontend** — `/register` (فریم ۱-۴ انتخاب نقش + فریم ۱-۴ فرم مشتری)؛ `/login` (فریم ۱-۵)؛ api client با interceptor برای refresh؛ `AuthContext`؛ `ProtectedRoute`
- **Tests** — تست‌های مانی

> فرم ثبت‌نام آژانس فریم ندارد. طبق بخش ۱۶ همان فرم ساده ساخته شود.

### مانی
- **Backend** — مدل `Destination` با FK به Organization، به‌عنوان اولین مصرف‌کننده‌ی `TenantQuerySetMixin`
- **Frontend** — حالت لاگین‌شده/نشده‌ی هدر و سایدبار؛ منوی کاربر؛ Redirect پس از ورود بر اساس نقش
- **Tests** — تست‌های ایلیا

### ایلیا
- **Backend** — مدل `Customer` متصل به `User`
- **Frontend** — لایه‌ی مشترک فرم و اعتبارسنجی؛ نگاشت خطای DRF به پیام فارسی
- **Tests** — تست‌های پارسا: ثبت‌نام، ورود، refresh، `/auth/me`، رد شدن دسترسی Cross-tenant

**وابستگی:** مانی و ایلیا منتظر merge شدن مدل‌های پارسا هستند. پارسا اول migration را بفرستد.

---

## مرحله ۳ — منابع آژانس

**خروجی مرحله:** کارمند آژانس مقصد، هتل، حمل‌ونقل و راهنما را CRUD می‌کند و هر چهار مورد Tenant-scoped هستند.

### مانی
- **Backend** — `Hotel`، `Transportation`، `TourGuide` + تکمیل `Destination`؛ Serializer و ViewSet با فیلتر Organization؛ `CRUD /agency/destinations|hotels|transportation|guides`
- **Frontend** — **یک صفحه‌ی ژنریک `ResourceListPage`** طبق فریم ۴-۴ «الگوی مدیریت منابع»، سپس چهار مصرف از همان: `/app/destinations` `/app/hotels` `/app/transportation` `/app/guides` (فریم ۴-۵ برای راهنمایان)
- **Tests** — تست‌های ایلیا

> وایرفریم عمداً برای هتل و حمل‌ونقل فریم جدا نساخته. چهار صفحه‌ی جداگانه ننویسید.

### پارسا
- **Backend** — تبدیل `TenantQuerySetMixin` به Mixin واقعی و اعمالش روی هر چهار ViewSet؛ Permission نقش (فقط Admin و Staff آژانس)
- **Frontend** — `ConfirmDialog` واقعی برای حذف (کامپوننت ۱۱)؛ Toast مشترک
- **Tests** — تست‌های مانی: CRUD هر چهار منبع + Cross-tenant برای هر چهار

### ایلیا
- **Backend** — مدل و migration `Reservation` و `ReservationPassenger` (فقط مدل، بدون API)
- **Frontend** — تکمیل `Table`: مرتب‌سازی، صفحه‌بندی سروری، اتصال `EmptyState` و `LoadingState` (کامپوننت ۶، ۹، ۱۰، ۱۲)
- **Tests** — تست‌های پارسا: Permission نقش‌ها

**وابستگی:** مانی منتظر Mixin پارسا است.

---

## مرحله ۴ — تور و انتشار

**خروجی مرحله:** آژانس تور DRAFT می‌سازد، برنامه سفر و هتل و راهنما وصل می‌کند، Publish می‌کند، و تور DRAFT برای هیچ‌کس بیرون از آژانس دیده نمی‌شود.

### مانی
- **Backend** — `Tour` با `status` (DRAFT / PUBLISHED / CLOSED)؛ `ItineraryItem`؛ قواعد Publish (ظرفیت، تاریخ، حداقل فیلدهای لازم)؛ `GET/POST /agency/tours`، `GET/PATCH /agency/tours/{id}`، `POST /agency/tours/{id}/publish`
- **Frontend** — `/app/tours` (فریم ۳-۳)؛ `/app/tours/[id]` (فریم ۳-۴، فرم چندبخشی ساخت/ویرایش + دکمه Publish)
- **Tests** — تست‌های ایلیا

### پارسا
- **Backend** — عبور `Tour` از Mixin ایزوله‌سازی؛ Permission انتشار فقط برای Admin آژانس
- **Frontend** — `/app` اسکلت داشبورد (فریم ۴-۱) با کارت‌های عددی خالی؛ در مرحله ۸ پر می‌شود
- **Tests** — تست‌های مانی: DRAFT برای آژانس دیگر نامرئی، Publish با فیلد ناقص رد شود، Cross-agency Tour access رد شود

### ایلیا
- **Backend** — فیلد ظرفیت روی `Tour` و متد فقط‌خواندنی `remaining_capacity` (هنوز بدون قفل)
- **Frontend** — `StatusBadge` در دو نسخه: تور (سه وضعیت) و رزرو (نُه وضعیت) طبق کامپوننت ۷
- **Tests** — تست‌های پارسا: Permission انتشار

---

## مرحله ۵ — مارکت‌پلیس عمومی

**خروجی مرحله:** مهمان و مشتری تورهای PUBLISHED همه‌ی آژانس‌ها را می‌بینند، جستجو و فیلتر می‌کنند، و جزئیات تور را باز می‌کنند.

### مانی
- **Backend** — `GET /tours` با جستجو و فیلتر (مقصد، تاریخ، قیمت، ظرفیت)؛ `GET /tours/{id}`؛ `GET /destinations` عمومی ساخته‌شده از Destinationهای تورهای Published
- **Frontend** — `/` (مرجع `Landing.html`)؛ `/tours` (فریم ۱-۲ + فریم حالت خالی)؛ `/tours/[id]` (فریم ۱-۳)؛ `/destinations` (فریم ۵-۶)
- **Tests** — تست‌های ایلیا

### پارسا
- **Backend** — کارکرد این چهار Endpoint بدون توکن؛ Serializer عمومی جدا از Serializer کنسول تا هیچ فیلد داخلی آژانس لو نرود
- **Frontend** — `TourCard` مشترک طبق کامپوننت ۵، شامل حالت «فقط N نفر ظرفیت باقی‌مانده»؛ عنوان و متای صفحه
- **Tests** — تست‌های مانی: DRAFT نامرئی، PUBLISHED مرئی، جستجو و فیلتر، تور پرشده مخفی نشود ولی دکمه Disabled باشد

### ایلیا
- **Backend** — نمایش `remaining_capacity` در پاسخ عمومی تور
- **Frontend** — کامپوننت جستجو و فیلتر مشترک + همگام‌سازی وضعیت با query string
- **Tests** — تست‌های پارسا: نشت نکردن فیلدهای داخلی در Endpointهای عمومی

---

## مرحله ۶ — رزرو و مسافران

**خروجی مرحله:** مشتری چند مسافر ثبت می‌کند، رزرو می‌سازد، و آن را در «رزروهای من» می‌بیند — **بدون اینکه ظرفیت تور تغییر کند**.

### ایلیا
- **Backend** — `Reservation`، `ReservationPassenger`، `ReservationStatusHistory`؛ سرویس Transition؛ `POST /reservations`؛ `GET /me/reservations`؛ `GET /me/reservations/{id}`
- **Frontend** — `/booking/[tourId]` (فریم ۲-۱، فرم چندمسافره)؛ `/booking/[tourId]/review` (فریم ۲-۲)؛ `/me/reservations` (فریم ۲-۳ + فریم حالت خالی)؛ `/me/reservations/[id]` (فریم ۲-۴)
- **Tests** — تست‌های پارسا

### پارسا
- **Backend** — Permission «مشتری فقط رزرو خودش»؛ تعلق گرفتن هر Reservation به آژانسِ صاحب تور
- **Frontend** — `StatusTimeline` نسخه‌ی مشتری: چهار فاز فارسی طبق کامپوننت ۸، بدون هیچ نام انگلیسی
- **Tests** — تست‌های مانی: تور Published با رزرو فعال در برابر ویرایش خطرناک محافظت شود

### مانی
- **Backend** — قفل کردن فیلدهای حساس تور (ظرفیت، تاریخ، قیمت) وقتی رزرو فعال دارد
- **Frontend** — نمایش خلاصه‌ی تور داخل صفحات رزرو با استفاده‌ی مجدد از `TourCard`
- **Tests** — تست‌های ایلیا: اعتبارسنجی مسافر، PENDING ظرفیت را کم نمی‌کند، Transition نامعتبر رد می‌شود، مشتری A رزرو مشتری B را نمی‌بیند

---

## مرحله ۷ — تأیید، پرداخت و ظرفیت

**خروجی مرحله:** آژانس رزرو را Approve می‌کند، مشتری پرداخت Mock انجام می‌دهد، ظرفیت به‌اندازه‌ی تعداد مسافر و به‌صورت اتمیک کم می‌شود، و دو پرداخت هم‌زمان نمی‌توانند از ظرفیت عبور کنند.

### ایلیا
- **Backend** — `GET /agency/reservations`؛ `GET /agency/reservations/{id}`؛ `POST /agency/reservations/{id}/transition`؛ `POST /reservations/{id}/pay`؛ مدل `Payment`؛ `select_for_update` روی Tour؛ کسر `passengers.count()`؛ Rollback کامل در شکست
- **Frontend** — `/me/payment/[id]` (فریم ۲-۵ + فریم نتیجه‌ی موفق)؛ `/app/reservations` (فریم ۳-۱ + فریم حالت خالی)؛ `/app/reservations/[id]` (فریم ۳-۲)؛ `/app/payments` (فریم ۵-۱)
- **Tests** — تست‌های پارسا

### پارسا
- **Backend** — Permission Transition (فقط کارمند آژانسِ صاحب تور)؛ تصمیم `PAYMENT_EXPIRED` — چون Celery خارج از Scope است، انقضا به‌صورت بررسی تنبل در لحظه‌ی درخواست پرداخت انجام شود
- **Frontend** — `StatusTimeline` نسخه‌ی آژانس: تاریخچه‌ی کامل با نام دقیق انگلیسی؛ `ConfirmDialog` برای Approve و Reject
- **Tests** — تست‌های مانی: ظرفیت لحظه‌ای درست نمایش داده شود، تور پرشده دکمه‌ی رزرو Disabled داشته باشد

### مانی
- **Backend** — انعکاس `remaining_capacity` به‌روزشده در مارکت‌پلیس
- **Frontend** — نمایش ظرفیت لحظه‌ای در `/tours/[id]` و Disable شدن دکمه رزرو
- **Tests** — تست‌های ایلیا: پرداخت موفق ظرفیت را به‌اندازه‌ی تعداد مسافر کم کند، پرداخت ناموفق ظرفیت را دست‌نخورده بگذارد، دو پرداخت هم‌زمان Overbook نکنند، Rollback کار کند

---

## مرحله ۸ — چرخه سفر و تکمیل کنسول

**خروجی مرحله:** رزرو از CONFIRMED تا COMPLETED پیش می‌رود و هر ۳۴ فریم وایرفریم پیاده‌سازی شده است.

### ایلیا
- **Backend** — Transitionهای `CONFIRMED → READY_FOR_TRAVEL → IN_PROGRESS → COMPLETED`؛ لغو رزرو پرداخت‌شده و آزادسازی ظرفیت؛ Endpointهای آمار داشبورد و گزارش
- **Frontend** — `/app` داشبورد کامل (فریم ۴-۱)؛ `/app/customers` (۴-۲)؛ `/app/customers/[id]` (۴-۳)؛ `/app/reports` (۵-۲)
- **Tests** — تست‌های پارسا

### پارسا
- **Backend** — `GET /organizations/current`؛ به‌روزرسانی سازمان؛ دعوت و مدیریت اعضا؛ `/me/profile`؛ نقش Platform Admin
- **Frontend** — `/app/settings/organization` (۵-۳)؛ `/app/settings/members` (۵-۴)؛ `/me/profile` (۵-۵)؛ `/admin` (۵-۷)
- **Tests** — تست‌های مانی: راهنما فقط تورهای اختصاص‌یافته به خودش را ببیند

### مانی
- **Backend** — اتصال `TourGuide` به یک `User` با نقش راهنما؛ Endpointهای `/guide` محدود به تورهای اختصاص‌یافته
- **Frontend** — `/guide` (۶-۱)؛ `/guide/[tourId]` (۶-۲)؛ `/guide/profile` (۶-۳)
- **Tests** — تست‌های ایلیا: چرخه‌ی کامل سفر تا COMPLETED، آزادسازی ظرفیت پس از لغو رزرو پرداخت‌شده

---

## 5.9 نقشه‌ی پوشش صفحات

هر ۲۹ Route وایرفریم + ۲ Route بازاستفاده (هتل و حمل‌ونقل) = ۳۱ صفحه:

| مرحله | مانی | پارسا | ایلیا |
|---|---|---|---|
| ۱ | Layoutها | bootstrap + توکن | ۱۲ کامپوننت پایه |
| ۲ | حالت هدر/سایدبار | `/register` `/login` | لایه فرم |
| ۳ | `/app/destinations` `/app/hotels` `/app/transportation` `/app/guides` | ConfirmDialog | Table کامل |
| ۴ | `/app/tours` `/app/tours/[id]` | `/app` اسکلت | StatusBadge |
| ۵ | `/` `/tours` `/tours/[id]` `/destinations` | TourCard | جستجو/فیلتر |
| ۶ | خلاصه تور در رزرو | Timeline مشتری | `/booking/[tourId]` `+/review` `/me/reservations` `+/[id]` |
| ۷ | ظرفیت لحظه‌ای | Timeline آژانس | `/me/payment/[id]` `/app/reservations` `+/[id]` `/app/payments` |
| ۸ | `/guide` `/guide/[tourId]` `/guide/profile` | `/app/settings/organization` `+/members` `/me/profile` `/admin` | `/app` `/app/customers` `+/[id]` `/app/reports` |

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
feature/<issue>-<n>
fix/<issue>-<n>
test/<issue>-<n>
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
