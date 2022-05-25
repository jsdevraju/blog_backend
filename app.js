//import all lib 
const express  = require('express');
const errorMiddleware = require('./middleware/error');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require("express-fileupload");
const dotenv = require('dotenv').config();
const morgan = require("morgan")

// define app variable
const app = express();


// Middleware
app.use(fileUpload({
    useTempFiles:true
}));
app.use(cors());
app.use(morgan("dev"))
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cookieParser());

// Import All Routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
// Routes Middleware
app.use('/api/v1', userRoutes);
app.use('/api/v1', postRoutes);

// Error Middleware
app.use(errorMiddleware)

// exports our app
module.exports = app;