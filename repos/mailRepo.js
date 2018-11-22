var db = require('../fn/mysql-db');

exports.insertMail = function(mail){
    var sql = `insert into mail(MailId, Subject, Content, Request, TypeID, PriorityId, StatusId, UserID, UpdateTime, IsDelete, IsSpam, ReplyTo, CompanyID) values('${mail.mailID}', '${mail.subject}', '${mail.content}', '${mail.request}', '${mail.typeID}', '${mail.priorityID}', '${mail.statusID}', '${mail.userID}', '${mail.updateTime}', '${mail.isDelete}', '${mail.isSpam}', '${mail.replyTo}', '${mail.companyID}')`;
    return db.write(sql);
}

exports.updateStatus = function(mail){
    var sql = `update mail set StatusId = '${mail.statusID}' where MailId = '${mail.mailID}'`;
    return db.write(sql);
}

exports.updateType = function(mail){
    var sql = `update mail set TypeID = '${mail.typeID}' where MailId = '${mail.mailID}'`;
    return db.write(sql);
}

exports.updatePriority = function(mail){
    var sql = `update mail set PriorityId = '${mail.priorityID}' where MailId = '${mail.mailID}'`;
    return db.write(sql);
}

exports.deleteMail = function(mailID){
    var sql = `update mail set IsDelete = '1' where MailId = '${mailID}'`;
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
    var sql = `SELECT m.MailId
                    , m.Subject
                    , m.Content
                    , m.Request
                    , mt.Name AS MailType
                    , p.Name AS Priority
                    , s.Name AS Status
                    , m.UserID
                    , m.UpdateTime
                    , m.IsDelete
                    , m.IsSpam
                    , m.ReplyTo
                    , m.CompanyId
                 FROM mail m INNER JOIN mailtype mt ON m.TypeID = mt.ID
                             INNER JOIN status s ON m.StatusId = s.ID
                             INNER JOIN priority p ON m.PriorityId = p.ID
                WHERE m.UserID = '${mail.userID}' AND m.StatusId <> '4' AND m.IsDelete = '0' AND m.CompanyId = '${mail.companyID}' AND m.ReplyTo = ''
                ORDER BY m.UpdateTime DESC`;
    return db.load(sql);
}

//Ticket chua chuyen nhuong
exports.getUnassignedTicket = function(mail){
    var sql = `SELECT m.MailId
                    , m.Subject
                    , m.Content
                    , m.Request
                    , mt.Name AS MailType
                    , p.Name AS Priority
                    , s.Name AS Status
                    , m.UserID
                    , m.UpdateTime
                    , m.IsDelete
                    , m.IsSpam
                    , m.ReplyTo
                    , m.CompanyId
                FROM mail m INNER JOIN mailtype mt ON m.TypeID = mt.ID
                            INNER JOIN status s ON m.StatusId = s.ID
                            INNER JOIN priority p ON m.PriorityId = p.ID
                WHERE m.UserID IS NULL and m.IsDelete = '0' and m.CompanyId = '${mail.companyID}' AND m.ReplyTo = ''
                ORDER BY m.UpdateTime DESC`;
    return db.load(sql);
}

//Tat ca ticket chua giai quyet (StatusId <> 4)
exports.getAllNotClose = function(mail){
    var sql = `SELECT m.MailId
                    , m.Subject
                    , m.Content
                    , m.Request
                    , mt.Name AS MailType
                    , p.Name AS Priority
                    , s.Name AS Status
                    , m.UserID
                    , m.UpdateTime
                    , m.IsDelete
                    , m.IsSpam
                    , m.ReplyTo
                    , m.CompanyId
                FROM mail m INNER JOIN mailtype mt ON m.TypeID = mt.ID
                            INNER JOIN status s ON m.StatusId = s.ID
                            INNER JOIN priority p ON m.PriorityId = p.ID
                WHERE m.StatusId <> '4' and m.IsDelete = '0' and m.CompanyId = '${mail.companyID}' AND m.ReplyTo = ''
                ORDER BY m.UpdateTime DESC`;
    return db.load(sql);
}

//Ticket moi (StatusId = 1)
exports.getNewSticket = function(mail){
    var sql = `SELECT m.MailId
                    , m.Subject
                    , m.Content
                    , m.Request
                    , mt.Name AS MailType
                    , p.Name AS Priority
                    , s.Name AS Status
                    , m.UserID
                    , m.UpdateTime
                    , m.IsDelete
                    , m.IsSpam
                    , m.ReplyTo
                    , m.CompanyId
                FROM mail m INNER JOIN mailtype mt ON m.TypeID = mt.ID
                            INNER JOIN status s ON m.StatusId = s.ID
                            INNER JOIN priority p ON m.PriorityId = p.ID
                WHERE m.StatusId = '1' and m.IsDelete = '0' and m.CompanyId = '${mail.companyID}' AND m.ReplyTo = ''
                ORDER BY m.UpdateTime DESC`;
    return db.load(sql);
}

//Ticket cho duyet (StatusId = 3)
exports.getPendingSticket = function(mail){
    var sql = `SELECT m.MailId
                    , m.Subject
                    , m.Content
                    , m.Request
                    , mt.Name AS MailType
                    , p.Name AS Priority
                    , s.Name AS Status
                    , m.UserID
                    , m.UpdateTime
                    , m.IsDelete
                    , m.IsSpam
                    , m.ReplyTo
                    , m.CompanyId
                FROM mail m INNER JOIN mailtype mt ON m.TypeID = mt.ID
                            INNER JOIN status s ON m.StatusId = s.ID
                            INNER JOIN priority p ON m.PriorityId = p.ID
                WHERE m.StatusId = '3' and m.IsDelete = '0' and m.CompanyId = '${mail.companyID}' AND m.ReplyTo = ''
                ORDER BY m.UpdateTime DESC`;
    return db.load(sql);
}

//Ticket da hoan tat (StatusId = 4)
exports.getClosedSticket = function(mail){
    var sql = `SELECT m.MailId
                    , m.Subject
                    , m.Content
                    , m.Request
                    , mt.Name AS MailType
                    , p.Name AS Priority
                    , s.Name AS Status
                    , m.UserID
                    , m.UpdateTime
                    , m.IsDelete
                    , m.IsSpam
                    , m.ReplyTo
                    , m.CompanyId
                FROM mail m INNER JOIN mailtype mt ON m.TypeID = mt.ID
                            INNER JOIN status s ON m.StatusId = s.ID
                            INNER JOIN priority p ON m.PriorityId = p.ID
                WHERE m.StatusId = '4' and m.IsDelete = '0' and m.CompanyId = '${mail.companyID}' AND m.ReplyTo = ''
                ORDER BY m.UpdateTime DESC`;
    return db.load(sql);
}

//Ticket da xoa (StatusId = 4)
exports.getDeletedSticket = function(mail){
    var sql = `SELECT m.MailId
                    , m.Subject
                    , m.Content
                    , m.Request
                    , mt.Name AS MailType
                    , p.Name AS Priority
                    , s.Name AS Status
                    , m.UserID
                    , m.UpdateTime
                    , m.IsDelete
                    , m.IsSpam
                    , m.ReplyTo
                    , m.CompanyId
                FROM mail m INNER JOIN mailtype mt ON m.TypeID = mt.ID
                            INNER JOIN status s ON m.StatusId = s.ID
                            INNER JOIN priority p ON m.PriorityId = p.ID
                WHERE m.IsDelete = '1' and m.CompanyId = '${mail.companyID}' AND m.ReplyTo = ''
                ORDER BY m.UpdateTime DESC`;
    return db.load(sql);
}

exports.getMailWithReply = function(mailId){
    var sql = `select * from mail where MailId = '${mailId}' or ReplyTo = '${mailId}' order by UpdateTime desc`;
    return db.load(sql);
}

exports.countQuantityMail = function(mail){
    var sql = `SELECT SUM(CASE
                            WHEN m.UserID = '${mail.userID}' AND m.StatusId <> '4' AND m.IsDelete = '0' THEN 1
                            ELSE 0
                        END) AS notCloseByUserID
                    , SUM(CASE
                            WHEN m.UserID IS NULL and m.IsDelete = '0' THEN 1
                            ELSE 0
                        END) AS unassignedTicket
                    , SUM(CASE
                            WHEN m.StatusId <> '4' and m.IsDelete = '0' THEN 1
                            ELSE 0
                        END) AS allNotClose
                    , SUM(CASE
                            WHEN m.StatusId = '1' and m.IsDelete = '0' THEN 1
                            ELSE 0
                        END) AS newTicket
                    , SUM(CASE
                            WHEN m.StatusId = '3' and m.IsDelete = '0' THEN 1
                            ELSE 0
                        END) AS pendingTicket
                    , SUM(CASE
                            WHEN m.StatusId = '4' and m.IsDelete = '0' THEN 1
                            ELSE 0
                        END) AS closedTicket
                    , SUM(CASE
                            WHEN m.IsDelete = '1' THEN 1
                            ELSE 0
                        END) AS deletedTicket
                 FROM mail m
                WHERE m.CompanyId = '${mail.companyID}' AND m.ReplyTo = ''`;
    return db.load(sql);
}