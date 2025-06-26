require('dotenv').config();
const express = require('express');
const authRoute = require('./routes/authRoute');

const app = express();


app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to the API!'
    });
})
app.use(express.json());
app.use('/api/v1/auth', authRoute);

const PORT = process.env.APP_PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})