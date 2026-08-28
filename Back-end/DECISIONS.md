# تصمیمات معماری Backend

## اپ‌ها و مسئولیت‌ها
- **`accounts`** (مسئول: پارسا)  
  - مدل User سفارشی
  - احراز هویت (JWT - Register/Login/Refresh)
  - پروفایل کاربر

- **`organizations`** (مسئول: پارسا)  
  - مدل Organization
  - مدل Membership
  - نقش‌ها (Admin, Staff, Customer, Guide)
  - ایزوله‌سازی Tenant (Mixin)

- **`tours`** (مسئول: مانی)  
  - مدل‌های: Destination, Hotel, Transportation, TourGuide, Tour, ItineraryItem
  - مدیریت منابع آژانس (CRUD)
  - انتشار تور (DRAFT / PUBLISHED / CLOSED)
  - مارکت‌پلیس عمومی (مشاهده و جستجوی تور)

- **`reservations`** (مسئول: ایلیا)  
  - مدل‌های: Reservation, ReservationPassenger, ReservationStatusHistory, Payment
  - وضعیت‌های ۹‌گانه رزرو
  - تراکنش‌های اتمیک ظرفیت
  - پرداخت Mock