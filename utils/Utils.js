require('dotenv').config();
var jwt = require('jsonwebtoken');

exports.generateToken = function(user) {
    //Dont use password and other sensitive fields
    //Use fields that are useful in other parts of the app/collections/models
    var u = {
        Email: user.Email,
        FirstName: user.FirstName,
        LastName: user.LastName,
        UserID: user.UserID.toString(),
        PhoneNumber: user.PhoneNumber != null ? user.PhoneNumber.toString() : null,
        CompanyID: user.CompanyID,
        CompanyName: user.CompanyName
    };
  
    return token = jwt.sign(u, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 7 // expires in 1 week
    });
}

exports.verifyToken = function(token){
    return jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
        return user;
    });
}