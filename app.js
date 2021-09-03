var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const mongoose=require("mongoose");

mongoose.connect('mongodb://localhost:27017/chatbox');


mongoose.connection.on("error",(err)=>{
    console.log("MongoDB connection error!!!"+err.message)
});
mongoose.connection.once("open",()=>{
    console.log("MongoDB connected")});

const { Schema } = mongoose;
const msgSchema=new Schema({name:String,msg:String});

const msg=mongoose.model("msg",msgSchema);

app.get('/', function(req, res){
   res.sendFile(__dirname+'/index.html')});
   
   io.on('connection', function(socket){
      console.log('A user connected');
      

      msg.find((err,msgs)=>{
         socket.emit('load',msgs);
      })
      
      socket.on('msg', function(data){
         const newmsg= new msg({name:data.name,msg:data.msg});
         newmsg.save();
         io.sockets.emit('newmsg', data);
      })
   });
   http.listen(3000, function(){
      console.log('listening on localhost:3000');
   });