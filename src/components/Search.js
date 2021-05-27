import React, {useEffect, useState} from "react";
import firebase from "../utils/Firebase";
import "firebase/firestore";
import 'firebase/storage';
import {map} from "lodash"
import {Link} from "react-router-dom";
import {ShowArtist} from "./Artists";
import {ShowAlbum} from "./Albums";
const db = firebase.firestore(firebase);

export default function Search(props){

    const {match} = props;

    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [songs, setSongs] = useState([]);

    useEffect(()=>{
        db.collection("artists").get().then(res =>{
            const arrayArtist = [];
            map(res.docs, artist =>{
                const data = artist.data();
                data.id = artist.id;
                if(data.name.toLowerCase().includes(match.params.query.toLowerCase())){
                    arrayArtist.push(data);
                }
            });
            setArtists(arrayArtist);
        });
    }, [match.params.query]);

    useEffect(()=>{
        db.collection("albums").get().then(res =>{
            const arrayAlbum = [];
            map(res.docs, album =>{
                const data = album.data();
                data.id = album.id;
                console.log(data.tile)
                if(data.tile.toLowerCase().includes(match.params.query.toLowerCase())){
                    arrayAlbum.push(data);
                }
            });
            setAlbums(arrayAlbum);
        });
    }, [match.params.query]);

    useEffect(()=>{
        db.collection("songs").get().then(res =>{
            const arraySong = [];
            map(res.docs, song =>{
                const data = song.data();
                data.id = song.id;
                console.log(song.tile)
                if(data.tile.toLowerCase().includes(match.params.query.toLowerCase())){
                    arraySong.push(data);
                }
            });
            setSongs(arraySong);
        });
    }, [match.params.query]);


    return(
        <div>
            <h1 className="pageTitle">Search results for {match.params.query}</h1>
            {
                artists[0] &&
                    <div>
                        <h4 className="searchSectionTitle">Artists</h4>
                        <div className="grid-container">
                            {map(artists, artist =>(
                                <ShowArtist artist={artist} />
                            ))}
                        </div>
                    </div>
            }

            {
                albums[0] &&
                    <div>
                        <h4 className="searchSectionTitle">Albums</h4>
                        <div className="grid-container">
                            {map(albums, album =>(
                                <ShowAlbum album={album} />
                            ))}
                        </div>
                    </div>
            }
        </div>
    )
}