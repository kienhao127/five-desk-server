var express = require('express');
var mailRepo = require('../repos/mailRepo');
var utils = require('../utils/Utils');
var router = express.Router();

router.post('/insertMail', (req, res) => {
    var mail = {
        mailID: req.body.mailID,
        subject: req.body.subject,
        content: req.body.content,
        request: req.body.request,
        typeID: req.body.typeID,
        priorityID: req.body.priorityID,
        statusID: req.body.statusID,
        userID: req.body.userID,
        updateTime: req.body.updateTime,
        isDelete: 0,
        isSpam: req.body.isSpam,
        replyTo: req.body.replyTo
    }
    console.log('mail', mail);
    mailRepo.insertMail(mail)
        .then(value => {
            console.log('value', value);

            res.statusCode = 201;
            res.json({
                returnCode: 1,
                message: 'success'
            })

        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on server console');
        })
})

module.exports = router;