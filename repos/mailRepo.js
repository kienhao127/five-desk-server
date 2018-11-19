var db = require('../fn/mysql-db');

exports.insertMail = function(mail){
    var sql = `insert into mail(MailId, Subject, Content, Request, TypeID, PriorityId, StatusId, UserID, UpdateTime, IsDelete, IsSpam, ReplyTo) values('${mail.mailID}', '${mail.subject}', '${mail.content}', '${mail.request}', '${mail.typeID}', '${mail.priorityID}', '${mail.statusID}', '${mail.userID}', '${mail.updateTime}', '${mail.isDelete}', '${mail.isSpam}', '${mail.replyTo}')`;
    return db.write(sql);
}

exports.updateStatus = function(mail){
    var sql = `update mail set StatusId = '${mail.statusID}' where MailId = '${mail.mailID}'`;
    return db.write(sql);
}

exports.updateSpam = function(mail){
    var sql = `update mail set IsSpam = '${mail.isSpam}' where MailId = '${mail.mailID}'`;
    return db.write(sql);
}

exports.getMail = function(mailId){
    var sql = `select * from mail where MailId = '${mailId}'`;
    return db.load(sql);
}

//Chua giai quyet cua ban (StatusId <> 4)
exports.getNotCloseByUserID = function(mail){
    var sql = `select * from mail where UserID = '${mail.userID}' and StatusId <> '4' and IsDelete = '0'`;
    return db.load(sql);
}

//Ticket chua chuyen nhuong
exports.getUnassignedTicket = function(){
    var sql = `select * from mail where UserID IS NULL and IsDelete = '0'`;
    return db.load(sql);
}

//Tat ca ticket chua giai quyet (StatusId <> 4)
exports.getAllNotClose = function(){
    var sql = `select * from mail where StatusId <> '4' and IsDelete = '0'`;
    return db.load(sql);
}

//Ticket moi (StatusId = 1)
exports.getNewSticket = function(){
    var sql = `select * from mail where StatusId = '1' and IsDelete = '0'`;
    return db.load(sql);
}

//Ticket cho duyet (StatusId = 3)
exports.getPendingSticket = function(){
    var sql = `select * from mail where StatusId = '3' and IsDelete = '0'`;
    return db.load(sql);
}

//Ticket da hoan tat (StatusId = 4)
exports.getClosedSticket = function(){
    var sql = `select * from mail where StatusId = '4' and IsDelete = '0'`;
    return db.load(sql);
}

//Ticket da xoa (StatusId = 4)
exports.getDeletedSticket = function(){
    var sql = `select * from mail where IsDelete = '1'`;
    return db.load(sql);
}