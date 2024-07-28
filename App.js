const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');

const userRouter = require("./routes/userRouter");

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/users' , userRouter)



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


