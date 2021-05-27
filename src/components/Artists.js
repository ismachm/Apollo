import React, {useState, useEffect} from "react";
import {Grid} from "semantic-ui-react"
import {map} from "lodash";
import {Link} from "react-router-dom";
import firebase from "../utils/Firebase";
import "firebase/firestore";

const db = firebase.firestore(firebase);

export default function Artists(){

    const[artists, setArtists] = useState([]);

    console.log(artists)

    useEffect(()=>{
        db.collection("artists").get().then( res =>{
            const arrayArtist = [];
            map(res.docs, artist =>{
                const data = artist.data();
                data.id = artist.id;
                arrayArtist.push(data);
            });
            setArtists(arrayArtist.sort((a, b) => (a.name > b.name) ? 1 : -1));
        })
    },[])

    return(
        <div className="allArtists">
            <h1 className="pageTitle">Artists</h1>
            <div className="grid-container">
                {map(artists, artist =>(
                    <ShowArtist artist={artist} />
                ))}
            </div>
        </div>
    )
}

export function ShowArtist(props){
    const {artist} = props;
    const [img, setImg] = useState(null)

    useEffect(()=>{
        firebase.storage().ref(`artist/${artist.unique}`).getDownloadURL().then(url =>{
            setImg(url);
        })
    },[artist])

    console.log(artist)
    return(
        <Link to={`/artist/${artist.id}`}  className="grid-item">
            <img className="sliderArtistAvatar" src={img} />
            <h6 className="artistGridName">{artist.name}</h6>
        </Link>
    )
}