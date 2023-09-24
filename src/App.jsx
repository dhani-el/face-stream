import { useEffect, useRef, useState, useImperativeHandle } from "react";
import { io } from "socket.io-client";
import SimplePeer  from "simple-peer";


import { LocalVideo,RemoteVideo } from "./components/video";

const socket = io(undefined,{autoConnect:false});

function App() {

  const [thereIsRemoteVideo, setRemoteVideo] = useState(true)
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  let vidStream
  useEffect(function(){
    navigator.mediaDevices.getUserMedia({video:true,audio:true})
    .then(stream=>{
      localVideoRef.current.srcObject = stream;
      vidStream = stream
    })
  });

  function handleStartCall(){
    socket.connect()
    let peer = new SimplePeer({initiator:true,trickle:false, stream:vidStream});

    peer.on("signal",function(data){
        socket.emit("offer",JSON.stringify(data));
    });

    peer.on("stream",function(stream){
      remoteVideoRef.current.srcObject = stream;
    });

    socket.emit("join",'room-1');

    socket.on("answer",function(data){
      peer.signal(JSON.parse(data))
    })

  }

  function handleJoinCall(){
    socket.connect()
    let peer = new SimplePeer({initiator:false,trickle:false, stream:vidStream});

    peer.on("signal",function(data){
      socket.emit("answer",JSON.stringify(data));
    });

    peer.on("stream",function(stream){
      remoteVideoRef.current.srcObject = stream;
    });

    socket.emit("join",'room-1');

  

    socket.on("offer",function(data){
      peer.signal(JSON.parse(data))
    })


  }

  return <div>
            <LocalVideo ref={localVideoRef} />
            { thereIsRemoteVideo && <RemoteVideo ref={remoteVideoRef} /> }
            <button onClick={handleStartCall} > Start Call </button>
            <button onClick={handleJoinCall} > Join Call </button>
        </div>
}



export default App
