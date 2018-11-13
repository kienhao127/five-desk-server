var db = require('../fn/mysql-db');

exports.getVisitorInfo = function(visitor) {
    var sql = `select * from visitor where VisitorID = '${visitor.VisitorID}' and isDelete = 0`;
	return db.load(sql);
}

exports.updateVisitorInfo = function(visitor) {
    var sql = "UPDATE visitor SET Email = '" + visitor.email + "', PhoneNumber = '" + visitor.phoneNumber + "', Notes = '" + visitor.notes + "' WHERE VisitorID = '" + visitor.visitorID +"'";
    return db.load(sql);
}

// exports.addVisitor = function(visitor){
//     var sql = "INSERT INTO user(Email, Name) VALUES('"+ visitor.email +"', '" + visitor.firstname + visitor.lastname +"')";
//     return db.write(sql);
// }