import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import './styles/index.css';

const  socket =  io("http://localhost:3000");

export default function ZocketZone(){
    const bigScreenRef = useRef(null);
    const textInputRef = useRef(null);
    const [Messages, setMessages] = useState([]);
    const [Text, setText] = useState('');
    const [Room, setRoom] = useState('');


    useEffect(function(){
        socket.on("connect",function(){
            appendMessageToState({message:`you connected to ${socket.id}`})
        });
        socket.on("receive-message", function(text){
            console.log("one");
            appendMessageToState({message:text, whoAmI:"others"})
        })
    },[]);

    function handleInputChange( val, setteaux){
        setteaux(function(v){
            return val
        })
    }

    async function handleInputSubmit(value){
        return new Promise(function(resolve){
            appendMessageToState({message:Text});
            textInputRef.current.value = "";
            setText(init=> "");
            return resolve()
        }).then(function(result){
            socket.emit("send-message",Text,Room)
        })
    }

    function appendMessageToState({message, whoAmI =""}){
        console.log("this is the message",message);
        setMessages(function(initArray){
            console.log(initArray);
            const newRay = initArray.concat([{message,whoAmI,date:new Date().toTimeString().slice(0,5)}]);
            console.log(newRay); 
            return newRay 
        });
    }

    function MessagesComponent(){
       return <div id="listOfMessagesContainer">
            {Messages.map(function(singleMessage){
                return (singleMessage.whoAmI === "") ? <MeMessage message={singleMessage.message} date={singleMessage.date} /> : <OthersMessage message={singleMessage.message} name={singleMessage.whoAmI} time={singleMessage.date}  />
            })}
        </div>
    }

    function handleRoomSubmit(){
        socket.emit("room-change",Room)
    }

    return <div id="containerDiv">

        <div data-output = "bigScreen" ref={bigScreenRef} >
            <MessagesComponent/>
        </div>

        <div className="inputContainer">
            <button>Text</button>  <input data-input ="text"  onChange={ function(e){ handleInputChange(e.target.value,setText)}}  ref={textInputRef} ></input> <button onClick={ function(){ handleInputSubmit(Text)}} >Send</button>
        </div>

        <div className="inputContainer">
            <button>Room</button>  <input data-input ="room"  onChange={ function(e){ handleInputChange(e.target.value,setRoom)}} ></input><button  onClick={()=> handleRoomSubmit()} >Send</button>
        </div>

    </div>
}


function OthersMessage({message, name, time}){
    return <div id="othersMessageDiv">
                <p>{name}</p>
                <p id="othersMessageP">{message}</p>
                <span id="othersMessageSpanTime" ><p  id="meMePTime">{time}</p></span>
            </div>
}

function MeMessage({message,date}){
    return <div id="meMessageDiv">
                <p id="meMessageP">{message}</p>
                <span id="meMessageSpan" ><p  id="meMeP">{date}</p></span>
            </div>
}