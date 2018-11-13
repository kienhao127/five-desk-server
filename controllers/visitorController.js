var express = require('express');
var visitorRepo = require('../repos/visitorRepo');

var router = express.Router();

router.post('/getVisitorInfo', (req, res) => {
    // console.log(req);
    var visitor = {
        VisitorID: req.body.visitorID,
    }
    visitorRepo.getVisitorInfo(visitor)
        .then(value => {
            var visitor = value[0];
            var message = '';
            var returnCode = 0;

            if(visitor != null) {
                message = 'success';
                returnCode = 1;
            } else {
                message = 'fail';
            }
            res.statusCode = 201;
            res.json({
                returnCode: returnCode,
                message: message,
                visitor: visitor,
            })
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on server console');
        })
})


router.post('/updateVisitorInfo', (req, res) => {
    // console.log(req);
    var visitor = {
        visitorID: req.body.visitorID,
        email: req.body.email,
        notes: req.body.notes,
        phoneNumber: req.body.phoneNumber,
    }
    visitorRepo.updateVisitorInfo(visitor)
    .then(value => {
        console.log(value);
        if (value.affectedRows > 0){
            res.statusCode = 201;
            res.json({
                returnCode: 1,
                message: 'Cập nhật thông tin thành công'
            })
        } else {
            res.statusCode = 201;
            res.json({
                returnCode: 0,
                message: 'Cập nhật thông tin thất bại'
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