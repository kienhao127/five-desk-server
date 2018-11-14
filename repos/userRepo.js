var db = require('../fn/mysql-db');

exports.login = function(u) {
    var sql = `select u.*, c.CompanyName from user u, company c where u.Email = '${u.email}' and u.Password = '${u.password}' and u.CompanyID = c.CompanyID`;
	return db.load(sql);
}

exports.register = function(u) {
    var sql = `insert into user(Email, Password, Avatar, FirstName, LastName, PhoneNumber, CompanyID, IsDelete, UserType, IsActive)
                values('${u.email}', '${u.password}', '${u.avatar}', '${u.firstname}', '${u.lastname}', '${u.phoneNumber}', '${u.company}', 
                '${u.isdelete}', '${u.type}', '${u.isactive}')`;
    return db.write(sql);
}

exports.insertCompany = function(name) {
    var sql = `insert into company(CompanyName) values('${name}')`;
    return db.write(sql);
}

exports.changePassword = function(user){
    var sql = "UPDATE user SET Password = '" + user.newPassword + "' WHERE UserID = '" + user.userID + "'";
	return db.load(sql);
}

exports.updateProfile = function(user){
    var sql = "UPDATE user SET FirstName = '" + user.firstname + "', LastName = '" + user.lastname + "', PhoneNumber ='" + user.phoneNumber + "' WHERE UserID = '" + user.userID + "'";
	return db.load(sql);
}

exports.addUser = function(user){
    var sql = "INSERT INTO user(Email, Password, FirstName, LastName, CompanyID, IsDelete, UserType, IsActive) VALUES('"+ user.email +"', '" + user.password + "', '" + user.firstname +"', '"+ user.lastname +"', '" + user.companyID +"', '0', '2', '1')";
    return db.write(sql);
}

exports.getListUser = function(u){
    var sql = `select * from user where CompanyID = '${u.companyID}' and isDelete = 0`;
	return db.load(sql);
}

exports.getUserInfo = function(u) {
    var sql = `select u.*, c.CompanyName from user u, company c where UserID = '${u.userID}' and u.CompanyID = c.CompanyID`;
	return db.load(sql);
}