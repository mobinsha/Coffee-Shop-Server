/**
 * Image Downloader for Coffee Shop
 * Downloads all images from database URLs and saves them locally
 * Then updates database to use local paths
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const https = require('https');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Configuration
const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'coffee-shop',
    port: process.env.DB_PORT || 3306
};

// Images directory
const IMAGES_DIR = path.join(__dirname, 'public', 'images');

// Ensure images directory exists
function ensureDirectoryExists() {
    if (!fs.existsSync(IMAGES_DIR)) {
        fs.mkdirSync(IMAGES_DIR, { recursive: true });
        log(`✅ Created directory: ${IMAGES_DIR}`, 'green');
    }
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
                        reject(new Error(`Failed to download ${filename}: ${redirectResponse.statusCode}`));
                    }
                }).on('error', reject);
            } else {
                reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
            }
        }).on('error', (err) => {
            fs.unlink(filepath, () => {}); // Delete partial file
            reject(err);
        });
    });
}

// Get all images from database
async function getImagesFromDatabase(connection) {
    const images = [];
    
    // Get products images
    const [products] = await connection.execute(
        'SELECT id, name, imageAddress FROM product WHERE imageAddress IS NOT NULL AND imageAddress != ""'
    );
    products.forEach(p => {
        if (p.imageAddress && p.imageAddress.startsWith('http')) {
            images.push({
                id: p.id,
                table: 'product',
                name: p.name,
                url: p.imageAddress,
                type: 'product'
            });
        }
    });
    
    // Get services images
    const [services] = await connection.execute(
        'SELECT id, name, imageAddress FROM services WHERE imageAddress IS NOT NULL AND imageAddress != ""'
    );
    services.forEach(s => {
        if (s.imageAddress && s.imageAddress.startsWith('http')) {
            images.push({
                id: s.id,
                table: 'services',
                name: s.name,
                url: s.imageAddress,
                type: 'service'
            });
        }
    });
    
    // Get blogs images
    const [blogs] = await connection.execute(
        'SELECT id, title, imageAddress FROM blogs WHERE imageAddress IS NOT NULL AND imageAddress != ""'
    );
    blogs.forEach(b => {
        if (b.imageAddress && b.imageAddress.startsWith('http')) {
            images.push({
                id: b.id,
                table: 'blogs',
                name: b.title,
                url: b.imageAddress,
                type: 'blog'
            });
        }
    });
    
    return images;
}

// Generate filename from URL
function generateFilename(item, index) {
    const ext = '.jpg'; // Default to jpg
    const prefix = item.type;
    const safeName = item.name.replace(/[^a-z0-9\u0600-\u06FF]/gi, '_').substring(0, 30);
    return `${prefix}_${index + 1}_${safeName}${ext}`;
}

// Update database with local path
async function updateDatabase(connection, table, id, localPath) {
    await connection.execute(
        `UPDATE ${table} SET imageAddress = ? WHERE id = ?`,
        [localPath, id]
    );
}

// Main function
async function downloadAllImages() {
    console.log('\n');
    log('☕ Coffee Shop Image Downloader', 'cyan');
    log('═══════════════════════════════════════', 'cyan');
    console.log('\n');
    
    let connection;
    
    try {
        // Ensure directory exists
        ensureDirectoryExists();
        
        // Connect to database
        log('🔗 Connecting to database...', 'blue');
        connection = await mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port
        });
        log('✅ Connected to database', 'green');
        console.log('\n');
        
        // Get all images
        log('🔍 Fetching images from database...', 'blue');
        const images = await getImagesFromDatabase(connection);
        log(`Found ${images.length} images to download`, 'yellow');
        console.log('\n');
        
        if (images.length === 0) {
            log('No external images found in database!', 'yellow');
            return;
        }
        
        // Download images
        log('⬇️  Downloading images...', 'blue');
        console.log('\n');
        
        let successCount = 0;
        let failCount = 0;
        
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const filename = generateFilename(image, i);
            
            try {
                await downloadImage(image.url, filename);
                
                // Update database
                const localPath = `/images/${filename}`;
                await updateDatabase(connection, image.table, image.id, localPath);
                
                successCount++;
            } catch (error) {
                log(`❌ Failed: ${image.name} - ${error.message}`, 'red');
                failCount++;
            }
        }
        
        console.log('\n');
        log('═══════════════════════════════════════', 'green');
        log('✅ Download complete!', 'green');
        log(`📊 Success: ${successCount}, Failed: ${failCount}`, 'yellow');
        log('═══════════════════════════════════════', 'green');
        console.log('\n');
        
        log('💡 Tips:', 'cyan');
        log('   • Images are saved in: public/images/', 'reset');
        log('   • Database has been updated with local paths', 'reset');
        log('   • Restart the server to see changes', 'reset');
        console.log('\n');
        
    } catch (error) {
        console.log('\n');
        log('═══════════════════════════════════════', 'red');
        log('❌ Error:', 'red');
        log(error.message, 'red');
        log('═══════════════════════════════════════', 'red');
        console.log('\n');
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run if called directly
if (require.main === module) {
    downloadAllImages().catch(() => process.exit(1));
}

module.exports = { downloadAllImages };
