const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import Routes
const authRoute = require('./routes/auth');

dotenv.config();

// Connect to Db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, { useUnifiedTopology: true }, () => {
    console.log('connected to db!');
});

// Middleware
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }))


// Route Middleware
app.use('/api/user', authRoute);



app.listen(3000, () => {
    console.log('Server running');
})