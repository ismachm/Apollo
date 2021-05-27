import React, {useEffect, useState} from "react";
import BasicSliderItems from "./Sliders/BasicSliderItems/BasicSliderItems";
import firebase from "../utils/Firebase";
import "firebase/firestore";
import {map} from "lodash";

const db = firebase.firestore(firebase);

export default function Home(props){

    const {playerSong} = props;
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [songs, setSongs] = useState([]);

    useEffect(()=>{
        db.collection("artists").get().then(response=>{
            const artistsArray =[];
            map(response?.docs, artist =>{
                const data = artist.data();
                data.id = artist.id;
                artistsArray.push(data);
            });
            setArtists(artistsArray);
        })
    }, [])

    useEffect(()=>{
        db.collection("albums").get().then(response=>{
            const albumsArray =[];
            map(response?.docs, album =>{
                const data = album.data();
                data.id = album.id;
                albumsArray.push(data);
            });
            setAlbums(albumsArray);
        })
    }, [])

    useEffect(()=>{
        db.collection("songs").get().then(response=>{
            const songsArray =[];
            map(response?.docs, song =>{
                const data = song.data();
                data.id = song.data().album;
                map(albums, album =>{
                    if(album.id == song.data().album){
                        data.albumUnique = album.unique;
                        console.log(data.albumUnique)
                    }
                })
                songsArray.push(data);
            });
            setSongs(songsArray);
        })
    }, [albums])

    return(
        <div>
            <h1 className="pageTitle">Home</h1>
            <BasicSliderItems className="basicSliderItems" title="Featured Artists" data={artists} folderImage="artist" urlName="artist"/>
            <BasicSliderItems className="basicSliderItems" title="Featured Albums" data={albums} folderImage="album" urlName="album"/>
            <BasicSliderItems className="basicSliderItems" title="Featured Songs" data={songs} folderImage="album" urlName="album" playerSong={playerSong}/>
        </div>
    )
}