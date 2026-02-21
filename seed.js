/**
 * Coffee Shop Database Seeder
 * Automatically creates tables, downloads images, and seeds initial data
 * Set Startup=true in .env to enable auto-seeding on server start
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const https = require('https');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'coffee-shop',
    port: process.env.DB_PORT || 3306,
    enableStartup: process.env.Startup === 'true' || process.env.STARTUP === 'true'
};

// Images directory
const IMAGES_DIR = path.join(__dirname, 'public', 'images');

// Ensure images directory exists
function ensureImagesDirectory() {
    if (!fs.existsSync(IMAGES_DIR)) {
        fs.mkdirSync(IMAGES_DIR, { recursive: true });
        log(`✅ Created images directory: ${IMAGES_DIR}`, 'green');
    }
}

// Admin credentials (will be displayed in console)
const ADMIN_CREDENTIALS = {
    userName: 'admin',
    password: 'Admin@123',
    email: 'admin@coffeeshop.ir',
    fullName: 'مدیر سیستم',
    phoneNumber: '09123456789'
};

// SQL Statements for creating tables (each as separate statement)
const CREATE_TABLES = [
    // Users Table
    `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userName VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(128) NOT NULL,
        email VARCHAR(254) NOT NULL UNIQUE,
        fullName VARCHAR(100) NOT NULL,
        phoneNumber VARCHAR(15) NOT NULL,
        permission ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        accountStatus ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_permission (permission),
        INDEX idx_status (accountStatus)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci`,

    // Products Table
    `CREATE TABLE IF NOT EXISTS product (
        id INT AUTO_INCREMENT PRIMARY KEY,
        imageAddress VARCHAR(500) DEFAULT NULL,
        name VARCHAR(100) NOT NULL UNIQUE,
        shortTitle VARCHAR(100) DEFAULT NULL,
        price INT NOT NULL,
        description VARCHAR(500) DEFAULT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_price (price)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci`,

    // Services Table
    `CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        imageAddress VARCHAR(500) DEFAULT NULL,
        name VARCHAR(100) NOT NULL UNIQUE,
        description VARCHAR(255) DEFAULT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci`,

    // Blogs Table
    `CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content MEDIUMTEXT NOT NULL,
        adminId INT NOT NULL,
        imageAddress VARCHAR(500) DEFAULT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (adminId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_createdAt (createdAt)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci`,

    // Orders Table
    `CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT,
        totalAmount INT NOT NULL,
        status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci`,

    // Order Items Table
    `CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderId INT NOT NULL,
        productId INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price INT NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES product(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci`,

    // Cart Table
    `CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        productId INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES product(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (userId, productId),
        INDEX idx_userId (userId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci`
];

// Sample data for seeding
const SAMPLE_DATA = {
    users: [
        {
            userName: 'ali_reza',
            password: 'User@123',
            email: 'ali@coffeeshop.ir',
            fullName: 'علی رضایی',
            phoneNumber: '09121234567',
            permission: 'user'
        },
        {
            userName: 'maryam_k',
            password: 'User@123',
            email: 'maryam@coffeeshop.ir',
            fullName: 'مریم کریمی',
            phoneNumber: '09139876543',
            permission: 'user'
        },
        {
            userName: 'hassan_m',
            password: 'User@123',
            email: 'hassan@coffeeshop.ir',
            fullName: 'حسن محمدی',
            phoneNumber: '09155667788',
            permission: 'user'
        },
        {
            userName: 'sara_n',
            password: 'User@123',
            email: 'sara@coffeeshop.ir',
            fullName: 'سارا نوری',
            phoneNumber: '09166778899',
            permission: 'user'
        }
    ],
    
    products: [
        {
            name: 'اسپرسو',
            shortTitle: 'قهوه غلیظ و قوی',
            price: 45000,
            description: 'اسپرسوی اصیل ایتالیایی با طعم غنی و غلیظ. تهیه شده از بهترین دانه‌های عربیکا و روبوستا',
            imageAddress: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400'
        },
        {
            name: 'کاپوچینو',
            shortTitle: 'کلاسیک و دلنشین',
            price: 55000,
            description: 'ترکیب بی‌نظیر اسپرسو، شیر داغ و فوم شیر. مناسب برای عصرهای دلنشین',
            imageAddress: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400'
        },
        {
            name: 'لاته',
            shortTitle: 'نرم و کرمی',
            price: 58000,
            description: 'لاته با شیر بخار داده شده و لایه‌ای نازک از فوم روی آن. طعمی نرم و دلپذیر',
            imageAddress: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'
        },
        {
            name: 'آمریکانو',
            shortTitle: 'قوی و تلخ',
            price: 42000,
            description: 'اسپرسو رقیق شده با آب داغ. طعمی قوی برای دوستداران قهوه تلخ',
            imageAddress: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400'
        },
        {
            name: 'موکا',
            shortTitle: 'شکلاتی و خوشمزه',
            price: 62000,
            description: 'ترکیب شگفت‌انگیز اسپرسو، شیر داغ و سیروپ شکلات. عاشقان شکلات را به وجد می‌آورد',
            imageAddress: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400'
        },
        {
            name: 'آیس کافی',
            shortTitle: 'خنک و نشاط‌آور',
            price: 52000,
            description: 'قهوه سرد با یخ و شیر. انتخابی عالی برای روزهای گرم تابستان',
            imageAddress: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'
        },
        {
            name: 'فراپاچینو',
            shortTitle: 'یخی و خامه‌ای',
            price: 65000,
            description: 'نوشیدنی یخی مخلوط با طعم قهوه و خامه. محبوب طرفداران نوشیدنی‌های خنک',
            imageAddress: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400'
        },
        {
            name: 'کیک شکلاتی',
            shortTitle: 'لایه‌ای و خوشمزه',
            price: 48000,
            description: 'کیک شکلاتی سه لایه با خامه تازه. همراهی عالی با قهوه',
            imageAddress: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'
        },
        {
            name: 'کروسان کره‌ای',
            shortTitle: 'برشته و خوش‌عطر',
            price: 35000,
            description: 'کروسان تازه پخته شده با کره فرانسوی. طعمی بی‌نظیر برای صبحانه',
            imageAddress: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400'
        },
        {
            name: 'چای ماسالا',
            shortTitle: 'معطر و گرم',
            price: 38000,
            description: 'چای هندی با ادویه‌های معطر شامل دارچین، هل و زنجبیل',
            imageAddress: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400'
        },
        {
            name: 'هات چاکلت',
            shortTitle: 'گرم و شکلاتی',
            price: 45000,
            description: 'شکلات داغ با شیر و خامه. مناسب برای کودکان و بزرگسالان',
            imageAddress: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400'
        },
        {
            name: 'اسموتی توت‌فرنگی',
            shortTitle: 'تازه و سالم',
            price: 52000,
            description: 'اسموتی تازه توت‌فرنگی با ماست و عسل. انتخابی سالم و انرژی‌بخش',
            imageAddress: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?w=400'
        }
    ],
    
    services: [
        {
            name: 'پذیرایی ویژه',
            description: 'سرویس پذیرایی VIP با بهترین کیفیت',
            imageAddress: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400'
        },
        {
            name: 'قهوه‌های دمی',
            description: 'انواع قهوه‌های دمی و دستگاهی',
            imageAddress: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'
        },
        {
            name: 'بسته‌بندی بیرون‌بر',
            description: 'امکان سفارش بیرون‌بر با بسته‌بندی مناسب',
            imageAddress: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400'
        },
        {
            name: 'دسرهای روز',
            description: 'انواع دسر و شیرینی تازه روزانه',
            imageAddress: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400'
        },
        {
            name: 'تجهیزات Barista',
            description: 'فروش تجهیزات تخصصی باریستا',
            imageAddress: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400'
        }
    ],
    
    blogs: [
        {
            title: 'تاریخچه جالب قهوه در ایران',
            content: 'قهوه برای اولین بار در قرن نهم میلادی در اتیوپی کشف شد و سپس راه خود را به ایران باز کرد. در دوره صفویه، قهوه‌خانه‌ها به مراکز مهمی برای گردهمایی‌های اجتماعی و فرهنگی تبدیل شدند. امروزه ایران یکی از بزرگترین مصرف‌کنندگان قهوه در خاورمیانه است و فرهنگ کافه‌نشینی جایگاه ویژه‌ای در بین جوانان پیدا کرده است.',
            imageAddress: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'
        },
        {
            title: 'راهنمای کامل تهیه اسپرسو در خانه',
            content: 'برای تهیه یک اسپرسوی عالی در خانه، به دانه‌های تازه آسیاب شده، آب با دمای 90-95 درجه و دستگاه اسپرسو ساز مناسب نیاز دارید. نسبت قهوه به آب باید حدود 1 به 2 باشد. زمان استخراج ایده‌آل بین 25 تا 30 ثانیه است. با کمی تمرین می‌توانید اسپرسویی با کرمای طلایی و طعمی متعادل تهیه کنید.',
            imageAddress: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600'
        },
        {
            title: 'فواید سلامتی مصرف متعادل قهوه',
            content: 'تحقیقات نشان می‌دهد مصرف متعادل قهوه (3-4 فنجان در روز) می‌تواند فواید زیادی برای سلامتی داشته باشد. قهوه حاوی آنتی‌اکسیدان‌های قوی است، خطر ابتلا به دیابت نوع 2 را کاهش می‌دهد، از کبد محافظت می‌کند و حتی ممکن است خطر افسردگی را کاهش دهد. البته یادتان باشد که تعادل کلید اصلی است!',
            imageAddress: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600'
        },
        {
            title: 'معرفی انواع دانه‌های قهوه',
            content: 'دو نوع اصلی دانه قهوه عربیکا و روبوستا هستند. عربیکا با طعمی پیچیده و اسیدیتی بالا شناخته می‌شود و حدود 60٪ تولید جهانی را تشکیل می‌دهد. روبوستا کافئین بیشتری دارد، طعمی تلخ‌تر و غلیظ‌تر دارد و معمولاً در اسپرسو برای ایجاد کرما استفاده می‌شود.',
            imageAddress: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600'
        },
        {
            title: 'هنر Latte Art: از مبتدی تا حرفه‌ای',
            content: 'Latte Art یا هنر طراحی روی قهوه، ترکیبی از مهارت فنی و خلاقیت است. از طرح‌های ساده قلبی شکل تا طرح‌های پیچیده‌تر مانند رز و حتی چهره. برای شروع، نیاز به شیر بخار داده شده با بافت میکروفوم مناسب و البته تمرین مداوم دارید. این هنر علاوه بر زیبایی، نشان‌دهنده کیفیت شیر و تکنیک باریستا است.',
            imageAddress: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600'
        },
        {
            title: 'بهترین کافه‌های تهران برای کافه‌گردی',
            content: 'تهران پر است از کافه‌های متنوع با طراحی‌های منحصربفرد. از کافه‌های قدیمی و سنتی در بازار تا کافه‌های مدرن و مینیمال در شمال شهر. هر کدام فضا و منوی خاص خود را دارند. در این مقاله به معرفی برترین کافه‌های تهران با امکانات و ویژگی‌های هر یک می‌پردازیم.',
            imageAddress: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600'
        }
    ]
};

// Helper function for colored console output
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Download image from URL
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(IMAGES_DIR, filename);
        
        // Check if already exists
        if (fs.existsSync(filepath)) {
            log(`⏭️  Already exists: ${filename}`, 'yellow');
            resolve(filename);
            return;
        }

        const file = fs.createWriteStream(filepath);
        
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    log(`✅ Downloaded: ${filename}`, 'green');
                    resolve(filename);
                });
            } else if (response.statusCode === 302 || response.statusCode === 301) {
                // Handle redirect
                https.get(response.headers.location, (redirectResponse) => {
                    if (redirectResponse.statusCode === 200) {
                        redirectResponse.pipe(file);
                        file.on('finish', () => {
                            file.close();
                            log(`✅ Downloaded: ${filename}`, 'green');
                            resolve(filename);
                        });
                    } else {
                        reject(new Error(`Failed: ${redirectResponse.statusCode}`));
                    }
                }).on('error', reject);
            } else {
                reject(new Error(`Failed: ${response.statusCode}`));
            }
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
}

// Generate filename for image
function generateImageFilename(type, index, name) {
    const ext = '.jpg';
    const safeName = name.replace(/[^a-z0-9\u0600-\u06FF]/gi, '_').substring(0, 30);
    return `${type}_${index + 1}_${safeName}${ext}`;
}

// Helper function for box drawing
function drawBox(title, content) {
    const width = 60;
    const line = '═'.repeat(width);
    console.log(`\n${colors.cyan}╔${line}╗${colors.reset}`);
    console.log(`${colors.cyan}║${colors.bright}${title.padEnd(width)}${colors.reset}${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}╠${line}╣${colors.reset}`);
    content.forEach(line => {
        console.log(`${colors.cyan}║${colors.reset} ${line.padEnd(width - 1)}${colors.cyan}║${colors.reset}`);
    });
    console.log(`${colors.cyan}╚${line}╝${colors.reset}\n`);
}

// Create database if not exists
async function createDatabase(connection) {
    try {
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci`);
        log(`✅ Database '${config.database}' created or already exists`, 'green');
        return true;
    } catch (error) {
        log(`❌ Error creating database: ${error.message}`, 'red');
        return false;
    }
}

// Create tables
async function createTables(connection) {
    try {
        // Execute each CREATE TABLE statement separately
        for (let i = 0; i < CREATE_TABLES.length; i++) {
            await connection.execute(CREATE_TABLES[i]);
        }
        log('✅ All tables created successfully', 'green');
        return true;
    } catch (error) {
        log(`❌ Error creating tables: ${error.message}`, 'red');
        throw error;
    }
}

// Check if tables have data
async function checkExistingData(connection) {
    try {
        const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
        const [products] = await connection.execute('SELECT COUNT(*) as count FROM product');
        const [services] = await connection.execute('SELECT COUNT(*) as count FROM services');
        const [blogs] = await connection.execute('SELECT COUNT(*) as count FROM blogs');
        
        return {
            users: users[0].count,
            products: products[0].count,
            services: services[0].count,
            blogs: blogs[0].count
        };
    } catch (error) {
        return { users: 0, products: 0, services: 0, blogs: 0 };
    }
}

// Seed admin user
async function seedAdmin(connection) {
    try {
        const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, 11);
        
        const [result] = await connection.execute(
            `INSERT INTO users (userName, password, email, fullName, phoneNumber, permission, accountStatus) 
             VALUES (?, ?, ?, ?, ?, 'admin', 'active')`,
            [
                ADMIN_CREDENTIALS.userName,
                hashedPassword,
                ADMIN_CREDENTIALS.email,
                ADMIN_CREDENTIALS.fullName,
                ADMIN_CREDENTIALS.phoneNumber
            ]
        );
        
        log(`✅ Admin user created with ID: ${result.insertId}`, 'green');
        return result.insertId;
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            log('⚠️  Admin user already exists', 'yellow');
            const [rows] = await connection.execute(
                'SELECT id FROM users WHERE userName = ?',
                [ADMIN_CREDENTIALS.userName]
            );
            return rows[0]?.id;
        }
        throw error;
    }
}

// Seed regular users
async function seedUsers(connection) {
    let count = 0;
    for (const user of SAMPLE_DATA.users) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 11);
            await connection.execute(
                `INSERT INTO users (userName, password, email, fullName, phoneNumber, permission, accountStatus) 
                 VALUES (?, ?, ?, ?, ?, ?, 'active')`,
                [
                    user.userName,
                    hashedPassword,
                    user.email,
                    user.fullName,
                    user.phoneNumber,
                    user.permission
                ]
            );
            count++;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                log(`⚠️  User '${user.userName}' already exists`, 'yellow');
            } else {
                throw error;
            }
        }
    }
    log(`✅ ${count} regular users seeded`, 'green');
}

// Seed products with image download
async function seedProducts(connection) {
    let count = 0;
    let downloadedCount = 0;
    
    log('📥 Downloading product images...', 'blue');
    
    for (let i = 0; i < SAMPLE_DATA.products.length; i++) {
        const product = SAMPLE_DATA.products[i];
        try {
            // Download image
            let localImagePath = product.imageAddress;
            if (product.imageAddress && product.imageAddress.startsWith('http')) {
                const filename = generateImageFilename('product', i, product.name);
                try {
                    await downloadImage(product.imageAddress, filename);
                    localImagePath = `/images/${filename}`;
                    downloadedCount++;
                } catch (err) {
                    log(`⚠️  Failed to download image for ${product.name}, using URL`, 'yellow');
                }
            }
            
            // Insert into database
            await connection.execute(
                `INSERT INTO product (imageAddress, name, shortTitle, price, description) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    localImagePath,
                    product.name,
                    product.shortTitle,
                    product.price,
                    product.description
                ]
            );
            count++;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                log(`⚠️  Product '${product.name}' already exists`, 'yellow');
            } else {
                throw error;
            }
        }
    }
    log(`✅ ${count} products seeded (${downloadedCount} images downloaded)`, 'green');
}

// Seed services with image download
async function seedServices(connection) {
    let count = 0;
    let downloadedCount = 0;
    
    log('📥 Downloading service images...', 'blue');
    
    for (let i = 0; i < SAMPLE_DATA.services.length; i++) {
        const service = SAMPLE_DATA.services[i];
        try {
            // Download image
            let localImagePath = service.imageAddress;
            if (service.imageAddress && service.imageAddress.startsWith('http')) {
                const filename = generateImageFilename('service', i, service.name);
                try {
                    await downloadImage(service.imageAddress, filename);
                    localImagePath = `/images/${filename}`;
                    downloadedCount++;
                } catch (err) {
                    log(`⚠️  Failed to download image for ${service.name}, using URL`, 'yellow');
                }
            }
            
            // Insert into database
            await connection.execute(
                `INSERT INTO services (imageAddress, name, description) 
                 VALUES (?, ?, ?)`,
                [
                    localImagePath,
                    service.name,
                    service.description
                ]
            );
            count++;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                log(`⚠️  Service '${service.name}' already exists`, 'yellow');
            } else {
                throw error;
            }
        }
    }
    log(`✅ ${count} services seeded (${downloadedCount} images downloaded)`, 'green');
}

// Seed blogs with image download
async function seedBlogs(connection, adminId) {
    let count = 0;
    let downloadedCount = 0;
    
    log('📥 Downloading blog images...', 'blue');
    
    for (let i = 0; i < SAMPLE_DATA.blogs.length; i++) {
        const blog = SAMPLE_DATA.blogs[i];
        try {
            // Download image
            let localImagePath = blog.imageAddress;
            if (blog.imageAddress && blog.imageAddress.startsWith('http')) {
                const filename = generateImageFilename('blog', i, blog.title);
                try {
                    await downloadImage(blog.imageAddress, filename);
                    localImagePath = `/images/${filename}`;
                    downloadedCount++;
                } catch (err) {
                    log(`⚠️  Failed to download image for blog "${blog.title}", using URL`, 'yellow');
                }
            }
            
            // Insert into database
            await connection.execute(
                `INSERT INTO blogs (title, content, adminId, imageAddress) 
                 VALUES (?, ?, ?, ?)`,
                [
                    blog.title,
                    blog.content,
                    adminId,
                    localImagePath
                ]
            );
            count++;
        } catch (error) {
            log(`⚠️  Error seeding blog '${blog.title}': ${error.message}`, 'yellow');
        }
    }
    log(`✅ ${count} blogs seeded (${downloadedCount} images downloaded)`, 'green');
}

// Display admin credentials in a beautiful box
function displayAdminCredentials() {
    const content = [
        '',
        `👤 Username: ${ADMIN_CREDENTIALS.userName}`,
        `🔑 Password: ${ADMIN_CREDENTIALS.password}`,
        `📧 Email: ${ADMIN_CREDENTIALS.email}`,
        '',
        '🌐 Access the application at: http://localhost:3000',
        ''
    ];
    
    drawBox(' ADMIN CREDENTIALS - SAVE THESE! ', content);
}

// Main seeding function
async function seed() {
    console.log('\n');
    log('☕ Coffee Shop Database Seeder', 'cyan');
    log('═══════════════════════════════════════', 'cyan');
    console.log('\n');
    
    let connection;
    
    try {
        // Create images directory
        log('📁 Setting up images directory...', 'blue');
        ensureImagesDirectory();
        console.log('\n');
        
        // Connect to MySQL without database
        log('🔗 Connecting to MySQL...', 'blue');
        connection = await mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            port: config.port
        });
        
        log('✅ Connected to MySQL', 'green');
        
        // Create database
        const dbCreated = await createDatabase(connection);
        if (!dbCreated) {
            throw new Error('Failed to create database');
        }
        
        // Close and reconnect with database
        await connection.end();
        connection = await mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port
        });
        
        log(`✅ Connected to database '${config.database}'`, 'green');
        console.log('\n');
        
        // Create tables
        log('📊 Creating tables...', 'blue');
        await createTables(connection);
        console.log('\n');
        
        // Check existing data
        log('🔍 Checking existing data...', 'blue');
        const existingData = await checkExistingData(connection);
        log(`Found: ${existingData.users} users, ${existingData.products} products, ${existingData.services} services, ${existingData.blogs} blogs`, 'yellow');
        console.log('\n');
        
        // Seed data
        log('🌱 Seeding data...', 'blue');
        console.log('\n');
        
        // Seed admin
        const adminId = await seedAdmin(connection);
        
        // Seed regular users
        if (existingData.users < 5) {
            await seedUsers(connection);
        } else {
            log('⏭️  Skipping users seeding (already has data)', 'yellow');
        }
        
        // Seed products
        if (existingData.products < 5) {
            await seedProducts(connection);
        } else {
            log('⏭️  Skipping products seeding (already has data)', 'yellow');
        }
        
        // Seed services
        if (existingData.services < 3) {
            await seedServices(connection);
        } else {
            log('⏭️  Skipping services seeding (already has data)', 'yellow');
        }
        
        // Seed blogs
        if (existingData.blogs < 3 && adminId) {
            await seedBlogs(connection, adminId);
        } else {
            log('⏭️  Skipping blogs seeding (already has data)', 'yellow');
        }
        
        console.log('\n');
        log('═══════════════════════════════════════', 'green');
        log('✅ Database seeding completed successfully!', 'green');
        log('═══════════════════════════════════════', 'green');
        console.log('\n');
        
        // Display admin credentials
        displayAdminCredentials();
        
    } catch (error) {
        console.log('\n');
        log('═══════════════════════════════════════', 'red');
        log('❌ Error during seeding:', 'red');
        log(error.message, 'red');
        log('═══════════════════════════════════════', 'red');
        console.log('\n');
        console.log('💡 Tips:');
        console.log('   • Make sure MySQL is running');
        console.log('   • Check your .env file configuration');
        console.log('   • Ensure database credentials are correct');
        console.log('   • Try running: npm run seed');
        console.log('\n');
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Export for use in other files
module.exports = { seed };

// Run if called directly
if (require.main === module) {
    seed().catch(() => process.exit(1));
}
