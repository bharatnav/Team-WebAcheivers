const path = require("path");
const http = require("http");

const express = require("express");
const socketio = require("socket.io");
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users');
const app = express();
const server = http.createServer(app);
const io= socketio(server);


const { appendFile } = require("fs");
const { isObject } = require("util");
app.use(express.static(path.join(__dirname,'public')));
const self_help='self-help';
io.on('connection',socket=>{
  socket.on('joinRoom',({ username,room})=>{
    const user =userJoin(socket.id,username,room);
socket.join(user.room);
    socket.emit('message',formatMessage(self_help,'welcome to self_help chat section'));
    socket.broadcast.to(user.room).emit('message',formatMessage(self_help,`${user.username} has joined chat`)
    
    
    );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  })


 

//listen
socket.on('chatMessage',msg=>{
  const user = getCurrentUser(socket.id);
  io.to(user.room).emit('message',formatMessage(user.username,msg));
});
socket.on('disconnect',()=>{
  const user = userLeave(socket.id);
  if(user){
  io.emit('message',formatMessage(self_help,`${user.username} has left the room`));
  io.to(user.room).emit("roomUsers", {
    room: user.room,
    users: getRoomUsers(user.room),
  });
  }
  
})

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
