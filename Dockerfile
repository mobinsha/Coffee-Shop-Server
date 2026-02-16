# Coffee Shop - Dockerfile
# نسخه Node.js 18
FROM node:18-alpine

# تنظیم دایرکتوری کاری
WORKDIR /app

# کپی کردن package.json و package-lock.json
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm ci --only=production && npm cache clean --force

# کپی کردن سورس کد
COPY . .

# ایجاد دایرکتوری‌های لازم
RUN mkdir -p logs uploads

# اکسپوز کردن پورت
EXPOSE 3000

# اسکریپت برای اجرا
CMD ["npm", "start"]