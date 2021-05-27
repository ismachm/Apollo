import React, {useState, useEffect} from "react";
import {withRouter} from "react-router-dom";
import BasicSliderItems from "./Sliders/BasicSliderItems/BasicSliderItems";
import firebase from "../utils/Firebase";
import "firebase/firestore";
import 'firebase/storage';
import {map} from "lodash"
const db = firebase.firestore(firebase);

function Artist(props){
    const {match} = props;
    const [artist, setArtist] =  useState(null);
    const [album, setAlbum] =  useState([]);
    const [imageURL, setImageURL] =  useState(null);

    console.log(album)

    useEffect(()=>{
        db.collection("artists").doc(match?.params?.id).get().then(res =>{
            const data = res.data();
            data.id = res.id;
            setArtist(data);
        })

    }, [match?.params?.id])

    useEffect(()=>{
        if(artist){
            db.collection("albums").where("artist", "==", artist.id).get().then(res =>{
                const arrayAlbum = [];
                map(res.docs, album =>{
                    const data = album.data();
                    data.id = album.id;
                    arrayAlbum.push(data);
                });
                setAlbum(arrayAlbum);
            })
        }
    }, [artist])

    if(artist){
        firebase.storage().ref(`artist/${artist.unique}`).getDownloadURL().then(url =>{
            setImageURL(url)
        })
    }



    return(
        <div>
            <div className="artistPageBannerContainer" style={{background: `url(${imageURL ? imageURL : ''})`}}>
                <div className="artistPageGradient"/>
                <h6>{artist ? artist.info : ""}</h6>
                <h1 >{artist ? artist.name : ""}</h1>
            </div>
            <div className="artistAlbums">
                <BasicSliderItems title="Albums" data={album} folderImage="album" urlName="album" />
            </div>
        </div>
    )
}

export default withRouter(Artist)