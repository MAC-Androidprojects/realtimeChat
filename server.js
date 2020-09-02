//Setup the server

const express = require('express');
const http = require('http')
const path = require('path');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app)
const io = socketio(server);
app.use(express.static(path.join(__dirname, 'public')))
const formatMessage = require('./utls/messages')
const {userJoin , getCurrentUserId , userLeave , getRoom} = require('./utls/users')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/chat' ,  { useNewUrlParser: true , useUnifiedTopology: true })

//Connection
io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id ,username , room);

        socket.join(user.room);
        socket.emit('message', formatMessage('chatChord', 'welcome to chatCord'));//This would emit to the single user who is connected
        //When user connects
        socket.broadcast.to(user.room).emit('message', formatMessage('chatChord', `${user.username} has joined the chat`)) //The use of brodcast that it would be send the message to everyone else on the server except for the user that is connected
        //io.emit() that would send the message to everybody on the server
        
        //send Users and rooms info
        io.to(user.room).emit('roomUsers' , {
            room : user.room,
            users : getRoom(user.room)
        })
    })


    //When user disconnects
    
    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUserId(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message', formatMessage('chatChord', `${user.username} has left the chat`))
            io.to(user.room).emit('roomUsers' , {
                room : user.room,
                users : getRoom(user.room)
            })

        }
    })

})





//Listening on the port

const port = process.env.PORT || 3000;
server.listen(port, () => console.log('server runing on port 3000'))