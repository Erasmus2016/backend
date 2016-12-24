global.APPLICATION_PATH = __dirname;


global.ROOM_COUNT = 0;
global.VALIDATOR = require('./functions/validator/dataChecker');
global.RANDOM_NUMBER = require('./functions/randomNumber');

let Question = require('./class/question');
let question = new Question();

const Database = require('./class/database');

new Database(function (db) {
    global.DB = db;
});

    question.getQuestionWithAnswers('History', 'easy', "English").then(function (result) {
        console.log("Result from database call: " + result);
        console.log(result[0]);
        console.log(result[2]);
    });
// });
/**

 const Question = require('./class/question');
 const question = new Question();
 //
 let test = question.getQuestionWithAnswers("History", "easy", "English");
 //
 // var test2 = "";
 /**


 var Controller = require('./class/controller');

 const app = require('express')();

 // Allow CORS.
 app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
 });

 const server = require('http').Server(app);
 const io = require('socket.io')(server);

 server.listen(5000);

 app.get('/', function (req, res) {
 res.sendFile(__dirname + '/public/index.html');
 });

 var clients = [];
 var instances = [];
 io.on('connection', function (socket) {
 console.log('new client (' + socket.handshake.address + '[' + socket.id + '])');
 clients.push(socket);
 if (clients.length > 1)
 instances.push(new Controller(io, [clients.shift(), clients.shift()]));
 });*/