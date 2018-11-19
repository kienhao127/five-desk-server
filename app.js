var userCtrl = require('./controllers/userController');
var chatCtrl = require('./controllers/chatController');
var visitorCtrl = require('./controllers/visitorController');
var mailCtrl = require('./controllers/mailController');
var chatRepo = require('./repos/chatRepo');

var express = require('express')
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');

const path = require('path');

var port = process.env.PORT || 8888;
var server = app.listen(port, function(){
    console.log('Server listening on ' + port);
});
var io = require('socket.io').listen(server);

var utils = require('./utils/Utils');

//=======Mail gun======
const axios = require('axios');
const multer = require('multer');

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


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
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    setInterval(() => socket.emit('time', new Date().toTimeString()), 10000);

    //-----ACK-----
    socket.on('ackMessage', function(params){
        console.log('message: ', params);

        chatRepo.getListTopic(params)
        .then(value => {
            io.emit('reAckMessage', value);
        })
        .catch(value => {
            
        })
    });


    //-----Chat-----
    socket.on('chat message', function(msg){
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
                    if (value[0] != undefined){
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
            .catch((error)=>{
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
app.post('/webhook', multer().any(), function(req, res) {
    console.log('req body:' );
    var mailInfo = {
        to: rep.body.recipient, //"luongkienhao@fivedesk.tech"
        sender: rep.body.sender, //"luongkienhao@gmail.com"
        from: rep.body.from, //"Hào Lương <luongkienhao@gmail.com>"
        subject: req.body.subject,
        text: req.body['stripped-text'], //"rep mail"
        updateTime: req.body.timestamp, //"1542613201"
        replyTo: req.body['In-Reply-To'], //"<CA+8_AKESrsCaPnaTtLN42m=xazTOMqRoSt=WbwTP-LD8tWKkjw@mail.gmail.com>",
    }
    console.log(mailInfo);
    res.end();
});
//=============END RECEIVE MAIL==========
