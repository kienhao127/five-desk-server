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

router.post('/updateStatus', (req, res) => {
    var mail = {
        mailID: req.body.mailID,
        statusID: req.body.statusID
    }
    mailRepo.updateStatus(mail)
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

router.post('/updateSpam', (req, res) => {
    var mail = {
        mailID: req.body.mailID,
        isSpam: req.body.isSpam
    }
    mailRepo.updateSpam(mail)
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

router.post('/getNotCloseByUserID', (req, res) => {
    var user = utils.verifyToken(req.body.token);
    var mail = {
        userID: user.UserID,
        companyID: user.CompanyID
    }
    mailRepo.getNotCloseByUserID(mail)
        .then(value => {
            console.log('value', value);

            res.statusCode = 201;
            res.json({
                mail: value,
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

router.post('/getUnassignedTicket', (req, res) => {
    var user = utils.verifyToken(req.body.token);
    var mail = {
        companyID: user.CompanyID
    }
    mailRepo.getUnassignedTicket(mail)
        .then(value => {
            console.log('value', value);

            res.statusCode = 201;
            res.json({
                mail: value,
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

router.post('/getAllNotClose', (req, res) => {
    var user = utils.verifyToken(req.body.token);
    var mail = {
        companyID: user.CompanyID
    }
    mailRepo.getAllNotClose(mail)
        .then(value => {
            console.log('value', value);

            res.statusCode = 201;
            res.json({
                mail: value,
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

router.post('/getNewSticket', (req, res) => {
    var user = utils.verifyToken(req.body.token);
    var mail = {
        companyID: user.CompanyID
    }
    mailRepo.getNewSticket(mail)
        .then(value => {
            console.log('value', value);

            res.statusCode = 201;
            res.json({
                mail: value,
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

router.post('/getPendingSticket', (req, res) => {
    var user = utils.verifyToken(req.body.token);
    var mail = {
        companyID: user.CompanyID
    }
    mailRepo.getPendingSticket(mail)
        .then(value => {
            console.log('value', value);

            res.statusCode = 201;
            res.json({
                mail: value,
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

router.post('/getClosedSticket', (req, res) => {
    var user = utils.verifyToken(req.body.token);
    var mail = {
        companyID: user.CompanyID
    }
    mailRepo.getClosedSticket(mail)
        .then(value => {
            console.log('value', value);

            res.statusCode = 201;
            res.json({
                mail: value,
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

router.post('/getDeletedSticket', (req, res) => {
    var user = utils.verifyToken(req.body.token);
    var mail = {
        companyID: user.CompanyID
    }
    mailRepo.getDeletedSticket(mail)
        .then(value => {
            console.log('value', value);

            res.statusCode = 201;
            res.json({
                mail: value,
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

router.post('/sendMail', (req, res) => {
    //token, to, subject, content, typeID, priorityID, statusID
    var user = utils.verifyToken(req.body.token);
    var api_key = 'key-bbddcadf9073eb563a87ca5632fd3652';
    var DOMAIN = 'fivedesk.tech';
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

    var mailInfo = {
        from: user.CompanyEmail,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.content,
    }

    // var mailInfo = {
    //     from: 'Luong Kien Hao <luongkienhao@fivedesk.tech>',
    //     to: 'luongkienhao@gmail.com',
    //     subject: 'Testing mailgun api',
    //     text: 'Đây là nội dung mail được gửi từ mailgun!'
    // }

    var data = {
        from: mailInfo.from,
        to: mailInfo.to,
        subject: mailInfo.subject,
        text: mailInfo.text
    };
    
    mailgun.messages().send(data, function (error, body) {
        console.log(body);
        var mail = {
            mailID: body.id,
            subject: mailInfo.subject,
            content: mailInfo.text,
            request: mailInfo.to,
            typeID: req.body.typeID,
            priorityID: req.body.priorityID,
            statusID: req.body.statusID,
            userID: user.UserID,
            updateTime: new Date().getTime(),
            isDelete: 0,
            isSpam: 0,
            replyTo: req.body.replyTo != null ? req.body.replyTo : '',
            companyID: user.CompanyID
        }
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
    });
})

router.post('/getMail', (req, res) => {
    mailRepo.getMailWithReply(req.body.mailId)
            .then(value => {
                res.statusCode = 201;
                res.json({
                    listMail: value,
                    returnCode: 1,
                    message: 'success'
                })
            })
            .catch(error => {
                console.log(error)
            })
})

module.exports = router;