const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config();
const shopItemsRoute = require('./routes/shopItemsRoute');
const authRoute = require('./routes/authRoute');
const {shopItemsCollection} = require('./schemas/shopItemsSchema');
const {isUserLoggedIn} = require('./routes/middleware');




const app = express()
const port = process.env.PORT || 8000

//middleware
app.use(express.json());

app.use("/", shopItemsRoute);
app.use("/auth", authRoute);
app.use(isUserLoggedIn);

//connecting to database

const connect = mongoose.connect(process.env.mongoDBURL);

connect.then((req,res) =>{
    console.log("Connected to database.");
}).catch((error) =>{
    console.log("Unable to connect to database, error:", error);
});



app.listen(port, (req,res) =>{
    console.log(`Server running on port: ${port}.`)
});