var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


         // mongoose connection establishment
const mongoose=require("mongoose");
mongoose.connect('mongodb://localhost:27017/chatbox');
mongoose.connection.on("error",(err)=>{
    console.log("MongoDB connection error!!!"+err.message)
});
mongoose.connection.once("open",()=>{
    console.log("MongoDB connected")});


            //creating the message schema and model
const { Schema } = mongoose;
const msgSchema=new Schema({name:String,msg:String});
const msg=mongoose.model("msg",msgSchema);


            //routing the get request
app.get('/', function(req, res){
   res.sendFile(__dirname+'/index.html')});
   
   io.on('connection', function(socket){
      console.log('A user connected');
      
      //displaying al the stored messages
      msg.find((err,msgs)=>{
         socket.emit('load',msgs);
      })
      
      //displaying all the real time messages if sent
      socket.on('msg', function(data){

         //storing the message in database
         const newmsg= new msg({name:data.name,msg:data.msg});
         newmsg.save();

         //senting a real time message
         io.sockets.emit('newmsg', data);
      })
   });
   http.listen(3000, function(){
      console.log('listening on localhost:3000');
   });