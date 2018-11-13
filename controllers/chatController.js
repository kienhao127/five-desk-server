var express = require('express');
var chatRepo = require('../repos/chatRepo');
var utils = require('../utils/Utils');
var router = express.Router();

router.post('/getListTopic', (req, res) => {
    var user = utils.verifyToken(req.body.token);
    var topic = {
        id: user.CompanyID
    }
    chatRepo.getListTopic(topic)
        .then(value => {
            var listTopic = value;
            res.statusCode = 201; //tam thoi de 201
            if (listTopic.length > 0) {
                res.json({
                    returnCode: 1,
                    message: 'success',
                    listTopic: listTopic,
                })
            } else {
                res.json({
                    returnCode: 0,
                    message: 'fail',
                })
            }

        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on server console');
        })
})

router.post('/getTopic', (req, res) => {
    var topic = {
        id: req.body.topicID
    }
    chatRepo.getTopic(topic)
        .then(value => {
            var topic = value;
            var message = '';
            var returnCode = 0;
            
            res.statusCode = 201; //tam thoi de 201
            res.json({
                returnCode: topic.length > 0 ? 1 : 0,
                message: message,
                topic: topic,
            })
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on server console');
        })
})

router.post('/transferTopic', (req, res) => {
    var topic = {
        topicID: req.body.topicID,
        servicerID: req.body.servicerID

        // topicID: '127.0.0.3',
        // servicerID: 1,
    }
    chatRepo.transferTopic(topic)
        .then(value => {
            console.log(value);
            if (value.affectedRows > 0) {
                res.statusCode = 201;
                res.json({
                    returnCode: 1,
                    message: 'Chuyển tin nhắn thành công'
                })
            } else {
                res.statusCode = 201;
                res.json({
                    returnCode: 0,
                    message: 'Chuyển tin nhắn thất bại'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on server console');
        })
})

router.post('/updateUnreadMessage', (req, res) => {
    var topic = {
        topicID: req.body.topicID,
        unreadCount: req.body.unreadCount,
    }
    chatRepo.updateUnreadMessage(topic)
        .then(value => {
            console.log(value);
            if (value.affectedRows > 0) {
                res.statusCode = 201;
                res.json({
                    returnCode: 1,
                    message: 'Đã xem tin nhắn'
                })
            } else {
                res.statusCode = 201;
                res.json({
                    returnCode: 0,
                    message: 'Cập nhật thất bại'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on server console');
        })
})

router.post('/seenMessage', (req, res) => {
    var topic = {
        topicID: req.body.topicID,
    }
    chatRepo.seenMessage(topic)
        .then(value => {
            console.log(value);
            if (value.affectedRows > 0) {
                res.statusCode = 201;
                res.json({
                    returnCode: 1,
                    message: 'Đã xem tin nhắn'
                })
            } else {
                res.statusCode = 201;
                res.json({
                    returnCode: 0,
                    message: 'Cập nhật thất bại'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on server console');
        })
})

module.exports = router;