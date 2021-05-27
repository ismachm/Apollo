import React, {useState, useEffect} from "react";
import {Grid, Progress, Icon, Input, Image, GridColumn} from "semantic-ui-react";
import ReactPlayer from "react-player";
import {Link} from "react-router-dom";

export default function Player(props){

    const [playing, setPlaying] = useState(false)
    const [playerProgress, setPlayerProgress] = useState(0)
    const [trackLength, setTrackLength] = useState(0)
    const [volume, setVolume] = useState(0.5)
    const [currentVolume, setCurrentVolume] = useState(50)
    const {trackData} = props;

    useEffect(()=>{
        if(trackData?.url){
            onStart();
        }
    }, [trackData])

    useEffect(()=>{
        if(playerProgress == trackLength){
            setPlaying(false)
        }
    }, [playerProgress])


    const onStart = ()=>{
        setPlaying(true);
        console.log(playing)
    }

    const onPause = ()=>{
        setPlaying(false);
        console.log(playing)
    }

    const mute = ()=>{
        setCurrentVolume(volume);
        setVolume(0);
    }

    const unmute = ()=>{
        setVolume(currentVolume)
    }

    const volLabel = ()=>{
        if(volume >=0.5){
            return(
                <i className="bi bi-volume-up-fill" onClick={mute}/>
            )
        } else if(volume < 0.5 && volume >0){
            return (<i className="bi bi-volume-down-fill" onClick={mute}/>)
        } else{
            return(<i className="bi bi-volume-mute-fill" onClick={unmute}/>)
        }
    }

    const onProgress = data =>{
        setPlayerProgress(data.playedSeconds);
        setTrackLength(data.loadedSeconds);
    }


    return(
        <div className="player col-12" style={{background: `url(${trackData ? trackData.cover : ""})`}}>
            <div className="playerFilter" />
            <div className="grid">
                <div className="left">
                    <Image src={trackData?.cover} />
                    <div>
                        <p className="trackTitle"><Link to={`/album/${trackData?.albumId}`}>{trackData?.title}</Link></p>
                        <p className="trackArtist"><Link to={`/artist/${trackData?.artistId}`}>{trackData?.artist}</Link></p>
                    </div>
                </div>
                <div className="center">
                    <div className="controls">
                        {playing ?  <i onClick={onPause} className="bi bi-pause-circle-fill"/> : <i onClick={onStart} className="bi bi-play-circle-fill"/> }
                    </div>
                   <Progress progress="value" value={playerProgress} total={trackLength} size="tiny"/>
                </div>
                <div className="right">
                    <Input label={volLabel} type="range" min="0" max="1" step="0.01" name="vol" value={volume} className="vol" id="vol"
                           onChange={
                               (e, data) =>{
                                    setVolume(Number(data.value));
                                    let value = (data.value-data.min)/(data.max-data.min)*100
                                    document.getElementById("vol").style.background = 'linear-gradient(to right, white 0%, white ' + value + '%, #565656 ' + value + '%, #565656 100%)'}}/>
                </div>
            </div>
            <ReactPlayer className="reactPlayer" url={trackData?.url} playing={playing} height="0" width="0" volume={volume} onProgress={e =>{onProgress(e)}}/>
        </div>
    )
}