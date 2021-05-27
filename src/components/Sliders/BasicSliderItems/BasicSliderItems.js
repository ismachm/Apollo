import React, {useEffect, useState} from "react";
import {map} from 'lodash';
import Slider from 'react-slick';
import './BasicSliderItems.scss';
import firebase from '../../../utils/Firebase';
import 'firebase/storage';
import 'firebase/firestore';
import {Link} from "react-router-dom";

const db = firebase.firestore(firebase);

export default function BasicSliderItems(props){

    const {title, data, folderImage, urlName, playerSong} = props;
    const featuredArtists= data.slice(0,8)

    const settings = {
        dots: false,
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        centerMode: false,
        className: "sliderList"
    }

    return(
        <div className="slider">
            <h4>{title}</h4>
            <Slider {...settings}>
                {map(featuredArtists, item =>(
                    <RenderItem key={item.unique} item={item} folderImage={folderImage} urlName={urlName} playerSong={playerSong ? playerSong : null}/>
                ))}
            </Slider>
        </div>
    )
}

function RenderItem(props){
    const {item, folderImage, urlName, playerSong} = props;
    const [imageUrl, setImageUrl] = useState(null);
    const [artistId, setArtistId] = useState("");
    const [artistName, setArtistName] = useState("");
    useEffect(()=>{
        firebase.storage().ref(`${folderImage}/${item.albumUnique ? item.albumUnique : item.unique}`).getDownloadURL().then(url =>{
            setImageUrl(url)
        })
    }, [item, folderImage])
    const onPlay = ()=>{
        if(playerSong){
            db.collection("albums").doc(item.album).get().then(res=>{
                setArtistId(res.data().artist)
                db.collection("artists").doc(res.data().artist).get().then(response=>{
                    setArtistName(response.data().name);
                    playerSong(imageUrl, item.tile, response.data().name, item.album, res.data().artist, item.unique);
                })
            })
        }
    }

    return(
        <div  className="sliderListItem">
            <div className="sliderDiv">
                {item.albumUnique && (<i onClick={onPlay} className="bi bi-play-circle-fill playSong"/>)}
                <Link to={`/${urlName}/${item.id}`} className="homeCoverImg" ><img className={item.albumUnique ? "sliderArtistAvatar homeSong" : "sliderArtistAvatar"} src={imageUrl} /></Link>
            </div>
            <Link to={`/${urlName}/${item.id}`}><h6>{item.name ? item.name : item.tile}</h6></Link>
        </div>
    )
}