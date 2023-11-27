import { useState } from "react"


export default function Generation(){
    const [compz, setCompz] = useState([]);

    function handleAddNewCompClick(){
        console.log("inside handle add new comp click");
        setCompz(function(oldCompz){
            const newCompz = [...oldCompz,<TheComp/>];
            return newCompz
        })
    }
    return <div>
        <div>
            {compz.map(function(OneComp){
                return OneComp
            })}
            </div>
            <button onClick={handleAddNewCompClick} >add a new comp</button>
    </div>
}

function TheComp(){

    return <div>
        <p>one Comp</p>
    </div>
}