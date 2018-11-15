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