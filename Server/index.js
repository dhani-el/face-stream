const express  = require("express");
const http = require("http");
const path = require("path");
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server);


app.use(express.static(path.join(__dirname,"../dist")));

app.get("*",function(req,res){
    res.sendFile(path.join(__dirname,"../dist/index.html"));
});

app.get("/",function(req,res){
    res.send("app works this way i guess");
});


io.on("connection",function(socket){


    socket.on("join",function(room){

        socket.join(room);

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
    
})


server.listen(3000, function(){
    console.log("server is live");
})