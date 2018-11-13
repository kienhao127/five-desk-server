var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser');
    
var userCtrl = require('./controllers/userController');
var chatCtrl = require('./controllers/chatController');
var visitorCtrl = require('./controllers/visitorController');
var chatRepo = require('./repos/chatRepo');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var utils = require('./utils/Utils');

//=======Mail gun======
const axios = require('axios');
var multer = require('multer');

app.use(morgan('dev'));
app.use(bodyParser.json());
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

app.get('/', (req, res) => {
    res.json({
        msg: 'hello from nodejs api'
    });
})

app.use('/user', userCtrl);
app.use('/chat', chatCtrl);
app.use('/visitor', visitorCtrl);

//============SOCKET================
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

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
                            //Gửi tin nhắn đến client
                            io.emit('chat message', msg);
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    //-----KHÔNG: insert
                    } else {
                        chatRepo.insertTopic(topic)
                        .then(value => {
                            console.log('insertTopic', value);
                            //Gửi tin nhắn đến client
                            io.emit('chat message', msg);
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


//=============RECEIVE MAIL==============
// app.post('/webhook', multer().none(), function(req, res) {
//     console.log('req body' );
//     console.log(JSON.stringify(req.body['event-data']));

//     axios.get(req.body['event-data'].storage.url, {
//         auth: {
//           username: 'api',
//           password: api_key
//         }
//       }).then(({ data: mail }) => {
//         console.log(mail)
//       }, err => cb(err))
  
//     res.end();
// });
//=============END RECEIVE MAIL==========

//=============SEND MAIL==============
// var mailgun = require("mailgun-js");
// var api_key = '151f114e127434b1de581715ba40e7aa-c8e745ec-3cf4cbf8';
// var DOMAIN = 'fivedesk.tech';
// var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

// var data = {
//     from: 'Luong Kien Hao <luongkienhao@fivedesk.tech>',
//     to: 'hoangnam26101996@gmail.com',
//     subject: 'Testing mailgun api',
//     text: 'Đây là nội dung mail được gửi từ mailgun!'
//   };
  
//   mailgun.messages().send(data, function (error, body) {
//     console.log(body);
//   });
//=============END SEND MAIL==============

http.listen(4000, function(){
    console.log('listening on *:4000');
  });

var port = process.env.port || 8888;
app.listen(port, () => {
    console.log(`api running on port ${port}`);
})