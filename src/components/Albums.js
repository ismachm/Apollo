import React, {useState, useEffect} from "react";
import {Grid} from "semantic-ui-react"
import {map} from "lodash";
import {Link} from "react-router-dom";
import firebase from "../utils/Firebase";
import "firebase/firestore";

const db = firebase.firestore(firebase);

export default function Albums(){

    const[albums, setAlbums] = useState([]);

    console.log(albums)

    useEffect(()=>{
        db.collection("albums").get().then( res =>{
            const arrayAlbum = [];
            map(res.docs, album =>{
                const data = album.data();
                data.id = album.id;
                arrayAlbum.push(data);
            });
            setAlbums(arrayAlbum.sort((a, b) => (a.artist > b.artist) ? 1 : -1));
        })
    },[])

    return(
        <div className="allAlbums">
            <h1 className="pageTitle">Albums</h1>
            <div className="grid-container">
                {map(albums, album =>(
                    <ShowAlbum album={album} />
                ))}
            </div>
        </div>
    )
}

export function ShowAlbum(props){
    const {album} = props;
    const [cover, setCover] = useState(null)

    useEffect(()=>{
        firebase.storage().ref(`album/${album.unique}`).getDownloadURL().then(url =>{
            setCover(url);
        })
    },[album])

    console.log(album)
    return(
        <Link to={`/album/${album.id}`}  className="grid-item">
            <img className="sliderAlbumAvatar" src={cover} />
            <h6 className="albumGridName">{album.tile}</h6>
        </Link>
    )
}