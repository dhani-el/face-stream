import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {Peer} from "peerjs";
import { LocalVideo,RemoteVideo, RemoteVideos } from "./components/video";

const socket = io("http://localhost:3000");



const peer  = new Peer(undefined,{
  host:'/',
  port:"3001"
})

function App() {
let Idee
  peer.on("open",function(id){
    console.log("this user has room id of ", id);
    Idee = id;
  });

  const [thereIsRemoteVideo, setRemoteVideo] = useState(true);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [refs,setRefs] = useState([]);
  

  useEffect(function(){
    navigator.mediaDevices.getUserMedia({video:true,audio:true})
    .then(stream=>{
      localVideoRef.current.srcObject = stream;
    }).catch(error =>{
      console.log(error);
    })
  });


  function handleStartCall(){
    console.log('inside handle start click');
    socket.emit("start-call","daniel",'room-1');
    socket.on("new-user",function(text, peerid){
      console.log(text,peerid);
     const call =  peer.call(peerid, localVideoRef.current.srcObject);
      call.on("stream",function(remoteStream){
        remoteVideoRef.current.srcObject = remoteStream;
      });
      socket.on("addNewUser",function(streamPayload){
        setRefs(function(former){
          const ref = useRef(null);
          ref.current.srcObject = streamPayload;
          return former.push(ref);
        })
      })
    })
  }

  function handleJoinCall(){
    socket.emit("join-call",Idee);
    peer.on("call",function(call){
      call.answer(localVideoRef.current.srcObject);
      socket.emit("new-user-stream",localVideoRef.current.srcObject );
      call.on("stream",function(remoteStream){
        setRemoteVideo(true);
        remoteVideoRef.current.srcObject = remoteStream
      })
    })
  }

  return <div  style={{backgroundColor:"orange"}} >
            <LocalVideo ref={localVideoRef} />
            {/* { thereIsRemoteVideo && <RemoteVideo ref={remoteVideoRef} /> } */}
            <RemoteVideos refs={refs} />
            <button onClick={handleStartCall} > Start Call </button>
            <button onClick={handleJoinCall} > Join Call </button>
        </div>
}


export default App
