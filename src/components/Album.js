import React, {useState, useEffect} from "react";
import {Link, withRouter} from "react-router-dom";
import {map} from "lodash";
import ListSongs from "./ListSongs";
import firebase from "../utils/Firebase";
import "firebase/firestore";
import 'firebase/storage';

const db = firebase.firestore(firebase);

function Album(props){
    const {match, playerSong} = props;
    const [album, setAlbum] =  useState(null);
    const [artist, setArtist] =  useState(null);
    const [songs, setSongs] =  useState([]);
    const [imageURL, setImageURL] =  useState(null);

    useEffect(()=>{
        db.collection("albums").doc(match?.params?.id).get().then(res =>{
            const data = res.data();
            data.id = res.id;
            setAlbum(data);
        })

    }, [match?.params?.id])

    useEffect(()=>{
        if(album){
            firebase.storage().ref(`album/${album.unique}`).getDownloadURL().then(url =>{
                setImageURL(url)
            })

            db.collection("artists").doc(album.artist).get().then(res=>{
                setArtist(res.data())
            })
        }
    }, [album])

    useEffect(()=>{
        if (album){
            db.collection("songs").where("album", "==", album.id).get().then(res=>{
                const arraySongs = [];
                map(res?.docs, song =>{
                   const data = song.data();
                   data.id = song.id;
                   arraySongs.push(data)
                })
                setSongs(arraySongs);
            })
        }
    }, [album])

    return(
        <div>
            <div className="albumPageBannerContainer" style={{background: `url(${imageURL ? imageURL : ''})`}}>
                <div className="albumPageGradient"/>
                <div className="row">
                    <div className="albumPageCover col-4" style={{background: `url(${imageURL ? imageURL : ''})`}}/>
                    <div className="albumPageInfo col-8">
                        <h1 >{album ? album.tile : ""}</h1>
                        <h6><Link to={album ? `/artist/${album.artist}` : ""} className="albumArtistLink">{artist ? artist.name : ""}</Link> · {album ? album.year : ""}  · {album ? album.genre : ""}</h6>
                    </div>
                </div>
            </div>

            <div className="albumSongs">
                <ListSongs songs={songs} albumImage={imageURL} artist={artist} album={album} playerSong={playerSong}/>
            </div>
        </div>
    )
}

export default withRouter(Album)