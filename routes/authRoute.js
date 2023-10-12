const express = require('express');
const route = express.Router();
const {userCollection} = require('../schemas/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();
const {isUserLoggedIn} = require('./middleware');

// creating / registering users

route.post("/register", async(req,res) =>{
    const salt = bcrypt.genSaltSync(10);
    const hashedPassowrd = bcrypt.hashSync(req.body.password, salt);
    await userCollection.create({
        fullName: req.body.fullName,
        userName: req.body.userName,
        password : hashedPassowrd,
        role: req.body.role
    });
    res.status(201).send("User created successfully");
});

// Login users

route.post("/login", async (req, res) =>{
    const userDetail = await userCollection.findOne({userName: req.body.userName});


    if (!userDetail){
        return res.status(404).send("User-not-found.")
    };

    const doesPasswordMatch = bcrypt.compareSync(req.body.password, userDetail.password);

    if (!doesPasswordMatch) return res.status(400).send("Invalid credentials.");

    const token = jwt.sign({
        fullName:userDetail.fullName,
        userName: userDetail.userName,
        //userId: userDetail._id,
        role: userDetail.role
    }, process.env.SECRET);

    res.send({
        message: `${req.body.userName} logged in.`,
        token,
        //userDetail
    });
});


route.use(isUserLoggedIn);
// route for user to check their profile

route.get("/profile",  async(req, res ) =>{
    try {
        const user = await userCollection.findById(req.decoded.userId, "fullName userName");
        res.send(user);
        
    } catch (error) {
        console.log(error);
        res.status(500).send("internal-server-error");
        
    }

});

// get all registered users

route.get("/users", async(req,res) =>{
    const allUsers = await userCollection.find();

    if(allUsers.length == 0){
        return res.status(404).send("No user found.");
    }

    res.json(allUsers);
});

// Delete user by ID

route.delete("/deleteuser-id/:id", async(req,res) =>{
    const deletedUser = await userCollection.findByIdAndDelete(req.params.id);


    if (!deletedUser){
        return res.status(404).send("No user with such ID found.")
    }

    res.send("User deleted successfully.")
});





module.exports = route;
