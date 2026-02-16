const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const userRouter = require("./routes/userRouter");
const servicesRouter = require("./routes/servicesRouter");
const menuRouter = require("./routes/menuRouter");
const productRouter = require("./routes/productRouter");
const recommendedRouter = require("./routes/recommendedRouter");
const blogsRouter = require('./routes/blogsRouter')

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/users', userRouter)
app.use('/api/services', servicesRouter)
app.use('/api/menu', menuRouter)
app.use('/api/product', productRouter)
app.use('/api/recommended', recommendedRouter)
app.use('/api/blogs', blogsRouter)

app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


