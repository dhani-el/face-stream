import { useState, useRef } from "react";
import './styles/index.css';



export default function ZocketZone(){
    const bigScreenRef = useRef(null);
    const textInputRef = useRef(null);
    const [Messages, setMessages] = useState([]);
    const [Text, setText] = useState('');
    const [Room, setRoom] = useState('');

    function handleInputChange( val, setteaux){
        setteaux(function(v){
            return val
        })
    }

    function handleInputSubmit(value){
        appendMessageToState({message:Text});
        textInputRef.current.value = ""
        setText(init=> "");
    }

    function appendMessageToState({message, whoAmI ="",date = ""}){
        console.log("this is the message",message);
        setMessages(function(initArray){
            console.log(initArray);
            const newRay = initArray.concat([{message,whoAmI,date}]);
            console.log(newRay); 
            return newRay 
        });
    }

    function MessagesComponent(){
       return <div id="listOfMessagesContainer">
            {Messages.map(function(singleMessage){
                return (singleMessage.whoAmI === "") ? <MeMessage message={singleMessage.message} /> : <OthersMessage message={singleMessage.message} name={singleMessage.whoAmI} time={singleMessage.date}  />
            })}
        </div>
    }

    return <div id="containerDiv">

        <div data-output = "bigScreen" ref={bigScreenRef} >
            <MessagesComponent/>
        </div>

        <div className="inputContainer">
            <button>Text</button>  <input data-input ="text"  onChange={ function(e){ handleInputChange(e.target.value,setText)}}  ref={textInputRef} ></input> <button onClick={ function(){ handleInputSubmit(Text)}} >Send</button>
        </div>

        <div className="inputContainer">
            <button>Room</button>  <input data-input ="room"  onChange={ function(e){ handleInputChange(e.target.value,setRoom)}} ></input><button  >Send</button>
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

function MeMessage({message}){
    return <div id="meMessageDiv">
                <p id="meMessageP">{message}</p>
                <span id="meMessageSpan" ><p  id="meMeP">{new Date().getMinutes()}</p></span>
            </div>
}