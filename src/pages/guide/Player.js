import React from 'react'
import ReactPlayer from 'react-player/vimeo';

const Player = ({label, vimeoId}) => {
    return ( 
        <div align="center" style={{marginBottom: 20}}>
            <label>{label}</label>
            <ReactPlayer
              url={`https://vimeo.com/${vimeoId}`}
              width="100%"
              controls={true}
            />
        </div>
     );
}
 
export default Player;