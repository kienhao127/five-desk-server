var userCtrl = require('./controllers/userController');
var chatCtrl = require('./controllers/chatController');
var visitorCtrl = require('./controllers/visitorController');
var mailCtrl = require('./controllers/mailController');
var chatRepo = require('./repos/chatRepo');
var mailRepo = require('./repos/mailRepo');

var express = require('express')
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');

const path = require('path');

var port = process.env.PORT || 8888;
var server = app.listen(port, function () {
    console.log('Server listening on ' + port);
});
var io = require('socket.io').listen(server);

var utils = require('./utils/Utils');

//=======Mail gun======
const axios = require('axios');
const multer = require('multer');

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', function (req, res, next) {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/user', userCtrl);
app.use('/chat', chatCtrl);
app.use('/visitor', visitorCtrl);
app.use('/mail', mailCtrl);

//============SOCKET================
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    setInterval(() => socket.emit('time', new Date().toTimeString()), 10000);

    //-----ACK-----
    socket.on('ackMessage', function (params) {
        console.log('message: ', params);

        chatRepo.getListTopic(params)
            .then(value => {
                io.emit('reAckMessage', value);
            })
            .catch(value => {

            })
    });


    //-----Chat-----
    socket.on('chat message', function (msg) {
        //Gửi tin nhắn đến client
        io.sockets.emit('chat message', msg);
        //Nhận tin nhắn từ client
        console.log('message: ', msg);
        chatRepo.insertMessage(msg)
            .then(value => {
                console.log(value);
                var topic = {
                    LastMessageSendTime: msg.SendTime,
                    TopicID: msg.TopicID,
                    id: msg.TopicID,
                    VisitorName: msg.VisitorName ? msg.VisitorName : msg.SenderID,
                    UnreadMessageCount: 0,
                    ServicerID: msg.ServicerID ? msg.ServicerID : null,
                    CompanyID: msg.CompanyID
                }
                //------kiểm tra topic có tổn tại?-------
                chatRepo.getTopicInfo(topic)
                    .then(value => {
                        console.log('getTopic', value[0]);
                        //-----CÓ: update
                        if (value[0] != undefined) {
                            chatRepo.updateTopic(topic)
                                .then(value => {
                                    console.log('updateTopic', value);
                                    // io.emit('chat message', msg);
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                            //-----KHÔNG: insert
                        } else {
                            chatRepo.insertTopic(topic)
                                .then(value => {
                                    console.log('insertTopic', value);
                                    // io.emit('chat message', msg);
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
            .catch((error) => {
                console.log(error);
            });

        // //Kiểm tra xem còn tin nhắn chưa đọc hay không
        // var user = utils.verifyToken(msg.token);
        // chatRepo.countUnreadMessage(user)
        //     .then(value => {
        //         io.emit('unread message', value[0].UnreadMessageCount > 0);
        //     })
        //     .catch((error)=>{
        //         console.log(error);
        //     });

        //cập nhật là số lượng tin nhắn chưa đọc của 1 topic
        // chatRepo.getUnreadMessageOfTopic(msg.TopicID)
        //     .then(value => {
        //         var topic = {
        //             unreadCount: value[0].UnreadOfTopic,
        //             topicID: msg.TopicID,
        //         }
        //         chatRepo.updateUnreadMessage(topic)
        //         .then(value => {
        //             console.log(value);
        //         })
        //         .catch(err => {
        //             console.log(err);
        //         })
        //     })
        //     .catch((error)=>{
        //         console.log(error);
        //     });
    });
})

//============END SOCKET================


//------------MAIL GUN--------------
//=============RECEIVE MAIL==============
app.post('/webhook', multer().any(), function (req, res) {
    console.log('req body:');
    console.log(req.body);

    if (req.body['References'] != undefined) {
        var rootMailId = req.body['References'].split(' ')[0];
        mailRepo.getMail(rootMailId)
            .then(value => {
                console.log('get mail: ', value);
                var mail = value[0];
                var mailInfo = {
                    mailID: req.body['Message-Id'],
                    subject: req.body.subject,
                    content: req.body['body-html'].substring(15, req.body['body-html'].indexOf("</div>")),
                    request: req.body.sender,
                    typeID: mail.TypeID,
                    priorityID: mail.PriorityId,
                    statusID: mail.StatusId,
                    userID: mail.UserID,
                    updateTime: req.body.timestamp * 1000,
                    isDelete: 0,
                    isSpam: 0,
                    replyTo: mail.ReplyTo != '' ? mail.ReplyTo : rootMailId,
                    companyID: mail.CompanyId
                }
                io.sockets.emit('incomingMail');

                mailRepo.insertMail(mailInfo)
                    .then(value => {
                        console.log(value);
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
            .catch(error => {
                console.log(error)
            })
    } else {
        var mail = null;
        mailRepo.getCompanyID(req.body['recipient'])
            .then(value => {
                mail = value[0];
                var mailInfo = {
                    mailID: req.body['Message-Id'],
                    subject: req.body.subject,
                    content: req.body['stripped-text'],
                    request: req.body.sender,
                    typeID: 1,
                    priorityID: 1,
                    statusID: 1,
                    userID: null,
                    updateTime: req.body.timestamp * 1000,
                    isDelete: 0,
                    isSpam: 0,
                    replyTo: null,
                    companyID: mail.CompanyID
                }
                io.sockets.emit('incomingMail');
                mailRepo.insertMail(mailInfo)
                    .then(value => {
                        console.log(value);
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
    }

    res.end();
});
//=============END RECEIVE MAIL==========
