import React from "react";
import {Tab, Table} from "semantic-ui-react";
import firebase from "../utils/Firebase";
import "firebase/firestore";
import {map} from "lodash";
import {Link} from "react-router-dom";

const db = firebase.firestore(firebase);

export default function ListSongs(props){

    const {songs, albumImage, playerSong, artist, album} = props;

    return(
        <Table inverted className="listSongs">
            <Table.Header className="listSongsHeader">
                <Table.Row className="listSongsHeaderRow">
                    <Table.HeaderCell/>
                    <Table.HeaderCell/>
                </Table.Row>
            </Table.Header>
            <Table.Body className="listSongsBody">
                {map(songs, song =>(
                    <Song key={song.id} song={song} albumCover={albumImage} playerSong={playerSong} artist={artist} album={album}/>
                ))}
            </Table.Body>
        </Table>
    )
}

function Song(props){
    const {song, albumImg, playerSong, artist, album} = props;
    const onPlay = ()=>{
        if(playerSong){
            db.collection("albums").doc(song.album).get().then(res=>{
                db.collection("artists").doc(res.data().artist).get().then(response=>{
                    firebase.storage().ref(`album/${album.unique}`).getDownloadURL().then(url =>{
                        console.log(url)
                        playerSong(url, song.tile, response.data().name, song.album, res.data().artist, song.unique);
                    })
                })
            })
        }
    }

    return(
        <Table.Row onDoubleClick={onPlay} className="listSongsBodyRow">
            <Table.Cell collapsing>
                <i onClick={onPlay} className="bi bi-play-circle-fill"/>
            </Table.Cell>
            <Table.Cell>
                {song.tile}
                <p className="songArtist"><Link to={`../../artist/${album.artist}`}>{artist.name}</Link></p>
            </Table.Cell>
        </Table.Row>
    );
}