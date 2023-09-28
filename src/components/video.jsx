import{ forwardRef} from "react"


export const LocalVideo = forwardRef(  function(props,ref){
  
    return <div>
              <video  id="local-video" autoPlay muted ref={ref} ></video>
    </div>
  }
)

export const RemoteVideo = forwardRef(  function(props,ref){
  
  return <div>
            <video  id="remote-video" autoPlay muted ref={ref} ></video>
  </div>
}
)