// import all lib
const mongoose = require('mongoose');
const app  = require('./app');
const express  = require('express');
const dotenv = require('dotenv').config();

//Connected With MongoDb
mongoose.connect(process.env.MONGO_URI,  {useNewUrlParser:true, useUnifiedTopology:true}).then(() =>{
    console.log(`Db Connected`)
})

if(process.env.NODE_ENV === "production"){
    app.use(express.static("client/build"))
}

//Server Listing
app.listen(process.env.PORT, () =>{
    console.log(`Server Listing Port ${process.env.PORT}`)
})