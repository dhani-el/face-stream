import{ forwardRef} from "react"


export const LocalVideo = forwardRef(  function(props,ref){
  
    return <div>
            <p>local</p>
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


// export const RemoteVideos = forwardRef(function(props,ref){

//       return {

//       }
// })

export function RemoteVideos({refs}){

  return <>
        {
          refs.map(function(aRef){
            return <RemoteVideo ref={aRef} />
          })
        }
  </>

}