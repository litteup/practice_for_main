
const env = require('dotenv').config();
const jwt = require('jsonwebtoken');


// Writing a protected route
function isUserLoggedIn( req, res, next){
    const authorizationHeader = req.headers.authorization;
    //console.log(authorizationHeader);

    if (!authorizationHeader){
        res.status(401).send("No authorization header found.");
        return;
    };

    const value = authorizationHeader.split(" ");

    const tokenType = value[0];
    const tokenValue = value[1];

    if(tokenType == "Bearer"){
        const decoded = jwt.verify(tokenValue, process.env.SECRET);
        // console.log(decoded);
        req.decoded = decoded;
        next();
        return;
    };
    res.status(401).send("Not authorized");
     
};

function adminsOnly(req, res, next){
    if (req.decoded.role == "admin"){
        next();
    } else {
        res.status(401).send("You are not an admin.");
    }

};


module.exports = {
    isUserLoggedIn,
    adminsOnly
}