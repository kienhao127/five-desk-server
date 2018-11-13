var db = require('../fn/mysql-db');

exports.insertTopic = function(topic){
    var sql = `insert into topic(TopicID, VisitorName, UnreadMessageCount, ServicerID, LastMessageSendTime, isDelete, CompanyID) values('${topic.TopicID}', '${topic.VisitorName}', '${topic.UnreadMessageCount}', '${topic.ServicerID}', '${topic.LastMessageSendTime}', '0', '${topic.CompanyID}')`;
    return db.write(sql);
}

exports.getListTopic = function(topic) {
    var sql = `select * from topic where CompanyID = '${topic.id}' and isDelete = 0 order by LastMessageSendTime desc`;
	return db.load(sql);
}

exports.getTopic = function(topic) {
    var sql = `select * from message where TopicID = '${topic.id}' order by SendTime asc`;
	return db.load(sql);
}

exports.getTopicInfo = function(topic) {
    var sql = `select * from topic where TopicID = '${topic.TopicID}'`;
	return db.load(sql);
}

exports.insertMessage = function(msg) {
    var sql = `insert into message(TopicID, SenderID, RecieverID, Content, SendTime, TypeID, IsReceived, IsRead) values('${msg.TopicID}', '${msg.SenderID}', '${msg.RecieverID}', '${msg.Content}', '${msg.SendTime}', '${msg.TypeID}', '0', '0')`;
    return db.write(sql);
}

exports.transferTopic = function(topic){
    var sql = "UPDATE topic SET ServicerID = '" + topic.servicerID +"' WHERE TopicID = '" + topic.topicID + "'";
    return db.load(sql);
}

exports.updateTopic = function(topic){
    var sql = "UPDATE topic SET LastMessageSendTime = '" + topic.LastMessageSendTime +"' WHERE TopicID = '" + topic.TopicID + "'";
    return db.load(sql);
}

exports.receivedMessage = function(message){
    var sql = "UPDATE message SET IsReceived = '1' WHERE ID = '" + message.ID + "'";
    return db.load(sql);
}

exports.seenMessage = function(message){
    var sql = "UPDATE message SET IsRead = '1' WHERE TopicID = '" + message.topicID + "'";
    return db.load(sql);
}

exports.countUnreadMessage = function(topic){
    var sql = "SELECT COUNT(DISTINCT t.UnreadMessageCount) as UnreadMessageCount FROM topic t WHERE t.CompanyID = '" + topic.CompanyID +"'";
    return db.load(sql)
}

exports.updateUnreadMessage = function(topic){
    var sql = "UPDATE topic SET UnreadMessageCount = '" + topic.unreadCount + "' WHERE TopicID = '" + topic.topicID + "'";
    return db.load(sql);
}

exports.getUnreadMessageOfTopic = function(topic){
    var sql = "SELECT COUNT(*) as UnreadOfTopic FROM message m WHERE m.IsRead = 0 and TopicID = '" + topic.topicID +"'";
    return db.load(sql);
}