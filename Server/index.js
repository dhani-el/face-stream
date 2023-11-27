const express  = require("express");
const http = require("http");
const path = require("path");
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
});

app.use(express.static(path.join(__dirname,"../dist")));

app.get("*",function(req,res){
    res.sendFile(path.join(__dirname,"../dist/index.html"));
});

app.get("/",function(req,res){
    res.send("app works this way i guess");
});

io.on("connection",function(socket){
    console.log(socket.id);
    socket.join("public");
    socket.on("send-message",function(text,room){
        console.log(text);
        room === "" ? socket.to("public").emit("receive-message",text) : socket.to(room).emit("receive-message",text)
    })

    socket.on("room-change",function(room){
        console.log(room);
        socket.join(room)
    })

    socket.on("join",function(room){
        socket.join(room);
    });

    socket.on("start-call",(name, room)=>{
        console.log(`${name} wants to create a call at the room ${room}`);
        socket.join(room);
    })

    socket.on("join-call",(peerId)=>{
        socket.join("room-1");
        socket.to("room-1").emit("new-user","a new user joined with a peerid of" , peerId);
    })


    socket.on("new-user-stream",(userStream)=>{
        socket.to("room-1").emit("addNewUser",userStream);
    });

    socket.on("offer", function(offer,room){

        socket.to(room).emit("offer",offer);

    });

    socket.on("answer",function(answer,room){

        socket.to(room).emit("answer",answer);

    });

    socket.on("ice-candidate",function(candidate,room){

        socket.to(room).emit("ice-candidate",candidate);

    });
    
});

server.listen(3000, function(){
    console.log("server is live");
})