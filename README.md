# Coffee Shop Server ☕

یک پروژه بک‌اند برای کافی‌شاپ با Node.js، Express.js و MySQL به همراه فرانت‌اند حرفه‌ای.

## 🚀 راه‌اندازی سریع با Docker Compose

### پیش‌نیازها
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### مراحل راه‌اندازی (3 قدم ساده!)

```bash
# 1. کلون کردن پروژه
git clone https://github.com/mobinsha/Coffee-Shop-Server.git
cd Coffee-Shop-Server

# 2. کپی فایل محیطی
cp .env.example .env

# 3. اجرای Docker Compose
docker-compose up -d
```

✅ **تمام!** پروژه آماده است:
- 🌐 **برنامه**: http://localhost:3000
- 🗄️ **phpMyAdmin**: http://localhost:8080 (root/rootpassword)

---

## 📚 راهنمای کامل

### 🔧 دستورات مفید

```bash
# مشاهده لاگ‌ها
docker-compose logs -f

# ری‌استارت برنامه
docker-compose restart app

# توقف برنامه
docker-compose down

# حذف کامل با دیتابیس
docker-compose down -v

# ورود به کانتینر برنامه
docker-compose exec app sh

# ورود به دیتابیس
docker-compose exec mysql mysql -u coffeeuser -p
```

### 🐛 عیب‌یابی

#### برنامه اجرا نمی‌شود:
```bash
# بررسی وضعیت سرویس‌ها
docker-compose ps

# مشاهده لاگ خطا
docker-compose logs app

# ری‌استارت همه سرویس‌ها
docker-compose restart
```

#### دیتابیس متصل نمی‌شود:
```bash
# صبر کنید تا MySQL کاملاً بالا بیاید (چند ثانیه)
docker-compose logs mysql

# ری‌استارت دیتابیس
docker-compose restart mysql
```

#### پاک کردن همه چیز و شروع مجدد:
```bash
docker-compose down -v
docker-compose up -d
```

---

## 📁 ساختار پروژه

```
Coffee-Shop-Server/
├── 📄 App.js                    # فایل اصلی برنامه
├── 🐳 docker-compose.yml        # تنظیمات Docker
├── 🐳 Dockerfile               # Dockerfile برنامه
├── ⚙️ .env.example             # نمونه تنظیمات
├── 📦 package.json             # وابستگی‌ها
├── 🗄️ database/
│   ├── init.sql               # اسکریپت اولیه دیتابیس
│   └── coffee-shop.sql        # بکاپ دیتابیس
├── 📂 config/
│   └── dbConnection.js        # اتصال به دیتابیس
├── 🎮 controllers/             # کنترلرهای API
├── 🗃️ models/                  # مدل‌های دیتابیس
├── 🛣️ routes/                  # روت‌های API
├── 🔒 middlewares/             # میدلورها
├── ✅ validations/             # اعتبارسنجی‌ها
├── 🛠️ utils/                   # توابع کمکی
└── 🎨 public/                  # فایل‌های فرانت‌اند
    ├── index.html
    ├── styles.css
    └── app.js
```

---

## 🔌 API Endpoints

### 👤 کاربران
| متد | آدرس | توضیحات |
|-----|------|---------|
| POST | `/api/users/register` | ثبت نام |
| POST | `/api/users/login` | ورود |
| GET | `/api/users` | لیست کاربران (ادمین) |
| GET | `/api/users/:id` | اطلاعات کاربر |
| PUT | `/api/users/update/:id` | بروزرسانی |
| DELETE | `/api/users/delete/:id` | حذف |

### ☕ محصولات
| متد | آدرس | توضیحات |
|-----|------|---------|
| GET | `/api/product` | لیست محصولات |
| GET | `/api/product/:id` | اطلاعات محصول |
| POST | `/api/product/add` | افزودن (ادمین) |
| PUT | `/api/product/update/:id` | بروزرسانی (ادمین) |
| DELETE | `/api/product/delete/:id` | حذف (ادمین) |

### 🛎️ خدمات
| متد | آدرس | توضیحات |
|-----|------|---------|
| GET | `/api/services` | لیست خدمات |
| GET | `/api/services/:id` | اطلاعات سرویس |
| POST | `/api/services/add` | افزودن (ادمین) |
| PUT | `/api/services/update/:id` | بروزرسانی (ادمین) |
| DELETE | `/api/services/delete/:id` | حذف (ادمین) |

### 📖 وبلاگ
| متد | آدرس | توضیحات |
|-----|------|---------|
| GET | `/api/blogs` | لیست پست‌ها |
| GET | `/api/blogs/:id` | اطلاعات پست |
| POST | `/api/blogs/add` | افزودن (ادمین) |
| PUT | `/api/blogs/update/:id` | بروزرسانی (ادمین) |
| DELETE | `/api/blogs/delete/:id` | حذف (ادمین) |

### 🎯 سایر
| متد | آدرس | توضیحات |
|-----|------|---------|
| GET | `/api/menu` | منوی تصادفی (8 آیتم) |
| GET | `/api/recommended` | پیشنهادات (5 آیتم) |

---

## 🎨 ویژگی‌های فرانت‌اند

- ✅ طراحی مدرن و ریسپانسیو
- ✅ پالت رنگی قهوه‌ای گرم
- ✅ انیمیشن‌های حرفه‌ای
- ✅ سیستم لاگین/رجیستر کامل
- ✅ سبد خرید با localStorage
- ✅ بارگذاری داینامیک محتوا
- ✅ کاملاً فارسی (RTL)

---

## 🔐 اطلاعات ورود پیش‌فرض

برای تست می‌توانید از این کاربر استفاده کنید:

| فیلد | مقدار |
|------|-------|
| Username | `admin123` |
| Password | `admin123` |
| Email | `admin1234@gamil.com` |
| Role | `admin` |

---

## 💻 توسعه محلی (بدون Docker)

اگر می‌خواهید بدون Docker کار کنید:

```bash
# 1. نصب MySQL به صورت لوکال
# 2. ایجاد دیتابیس و ایمپورت فایل database/coffee-shop.sql

# 3. نصب وابستگی‌ها
npm install

# 4. تنظیم فایل .env
# DB_HOST=localhost
# DB_USER=your_username
# DB_PASS=your_password
# DB_NAME=coffee-shop
# DB_PORT=3306

# 5. اجرا
npm run dev
```

---

## 🛠️ تکنولوژی‌ها

**Backend:**
- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcrypt.js
- express-validator

**Frontend:**
- HTML5
- CSS3 (Custom)
- JavaScript (Vanilla)
- Font Awesome
- Vazirmatn Font

**DevOps:**
- Docker
- Docker Compose

---

## 👤 نویسنده

**Mobin Shakeri**

- 🐙 GitHub: [@mobinsha](https://github.com/mobinsha)

---

## 📄 لایسنس

ISC License © 2024 Coffee Shop
