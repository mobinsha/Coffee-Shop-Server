require('dotenv').config();
const express = require('express')
const path = require('path');
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const { seed } = require('./seed');

const userRouter = require("./routes/userRouter");
const servicesRouter = require("./routes/servicesRouter");
const menuRouter = require("./routes/menuRouter");
const productRouter = require("./routes/productRouter");
const recommendedRouter = require("./routes/recommendedRouter");
const blogsRouter = require('./routes/blogsRouter');
const cartRouter = require('./routes/cartRouter');
const { initCartTable } = require('./models/cartModel');

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/users', userRouter)
app.use('/api/services', servicesRouter)
app.use('/api/menu', menuRouter)
app.use('/api/product', productRouter)
app.use('/api/recommended', recommendedRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/cart', cartRouter)

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin panel route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Admin login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Check if startup seeding is enabled
const enableStartup = process.env.Startup === 'true' || process.env.STARTUP === 'true';

async function startServer() {
    try {
        // Run seeding if enabled
        if (enableStartup) {
            console.log('\n🚀 Startup seeding is enabled. Running database seeder...\n');
            await seed();
            console.log('\n✅ Seeding completed. Starting server...\n');
        }
        
        // Initialize cart table
        try {
            await initCartTable();
            console.log('✅ Cart table initialized\n');
        } catch (err) {
            console.log('⚠️  Cart table initialization skipped or already exists\n');
        }
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`\n✅ Server is running on http://localhost:${PORT}`);
            console.log(`📁 API Documentation: http://localhost:${PORT}/api`);
            console.log(`🌐 Application: http://localhost:${PORT}\n`);
        });
    } catch (error) {
        console.error('\n❌ Failed to start server:', error.message);
        console.log('\n💡 You can still start the server without seeding by setting Startup=false in .env\n');
        process.exit(1);
    }
}

startServer();


