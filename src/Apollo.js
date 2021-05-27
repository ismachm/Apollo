import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Link, Route, withRouter} from "react-router-dom";
import firebase from "./utils/Firebase";
import "firebase/auth";
import "firebase/firestore";
import {Menu} from "semantic-ui-react";
import User from "./components/User";
import Home from "./components/Home";
import Songs from "./components/Songs";
import Albums from "./components/Albums";
import Explore from "./components/Explore";
import History from "./components/History";
import Artists from "./components/Artists";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import PasswordChange from "./components/Auth/PasswordChange";
import AddArtist from "./components/AddArtist";
import AddAlbum from "./components/AddAlbum";
import Artist from "./components/Artist";
import Album from "./components/Album";
import Player from "./components/Player";
import Search from "./components/Search";

import './index.scss';
import AddSong from "./components/AddSong";


function Apollo(props) {

    const {location} = props;

    const [user, setUser] = useState(null);
    const [trackData, setTrackData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(location.pathname);

    useEffect(() => {
        console.log(page)
    }, [page]);

    firebase.auth().onAuthStateChanged(currentUser => {
        if (!currentUser) {
            setUser(null);
        } else {
            setUser(currentUser);
        }
        setIsLoading(false);
    })

    if (isLoading) {
        return null;
    }

    function show() {
        document.getElementById("darken").style.display = "block";
        document.getElementById("log").style.display = "block";
    }

    function hide() {
        document.getElementById("darken").style.display = "none";
        document.getElementById("log").style.display = "none";
        document.getElementById("passwordChange").style.display = "none";
        document.getElementById("oldPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("err").style.display="none";
        document.getElementById("changed").style.display = "none";
        document.getElementById("notChanged").style.display = "none";
        document.getElementById("required").style.display = "none";
        document.getElementById("addArtist").style.display = "none";
        document.getElementById("addSong").style.display = "none";
        document.getElementById("addAlbum").style.display = "none";
        if (user===null){
            window.location.href = "/home"
        }
    }

    const activePage = (menu) => {
        setPage(menu.target.pathname);
    }

    window.addEventListener('popstate', ()=>{
        let p =  window.location.href.substring(window.location.href.lastIndexOf("/"), window.location.href.length);
        setPage(p);
    });

    function search(e){
        if(e.keyCode === 13){
            window.location.href=`/search/${document.getElementById("search").value}`;
        }
    }

    const playerSong = (albumCover, songTitle, artistName, albumId, artistId, songUrl) =>{

        firebase.storage().ref(`song/${songUrl}`).getDownloadURL().then(url =>{
            setTrackData({
                url: url,
                cover: albumCover,
                title: songTitle,
                artist: artistName,
                artistId: artistId,
                albumId: albumId
            })
        })

        console.log(trackData)



    }

    return (
        <div className="Apollo container-fluid">
            <Router>
                <div className="main row">
                    <div className="left-bar col-1 col-md-2 col-lg-2 col-xl-2">

                        {!user ? <div className="Sign row"><Link to="/signin" onClick={show} className="SignIn col-11">SIGN IN</Link><Link to="/signup" onClick={show} className="SignUp col-11">SIGN UP</Link></div> :
                            <div className="row">
                                <Menu.Item
                                    as={Link}
                                    to="/user"
                                    className="User col-11"
                                    active={page === "/user"}
                                    onClick={activePage}>
                                    {user.displayName}
                                </Menu.Item>
                            </div>
                        }
                        <Menu className="row">
                            <Menu.Item
                                as={Link}
                                to="/home"
                                id="home"
                                className="home col-11"
                                active={page === "/home"}
                                onClick={activePage}>
                                HOME
                            </Menu.Item>
                        </Menu>

                        <Menu className="row">
                            <div className="lib col-11">LIBRARY</div>
                            <Menu.Item
                                as={Link}
                                to="/albums"
                                className="albums col-11"
                                active={page === "/albums"}
                                onClick={activePage}>
                                <img alt=""/>&nbsp;&nbsp;ALBUMS
                            </Menu.Item>
                            <Menu.Item
                                as={Link}
                                to="/artists"
                                className="artists col-11"
                                active={page === "/artists"}
                                onClick={activePage}>
                                <img alt=""/>&nbsp;&nbsp;ARTISTS
                            </Menu.Item>
                        </Menu>
                    </div>

                    <div className="content col-10">
                        <div className="header row">
                            <History />
                            <input type="text" className="search" id="search" placeholder="Artists, albums or songs" onKeyDown={search}/>
                        </div>
                        <div className="main">
                            <Route path="/home" render={(props) => (<Home playerSong={playerSong}/>)}/>
                            <Route path="/user" component={User}/>
                            <Route path="/albums" component={Albums}/>
                            <Route path="/artists" component={Artists}/>
                            <Route path="/artist/:id" component={Artist}/>
                            <Route path="/album/:id"  render={(props) => (<Album playerSong={playerSong}/>)}/>
                            <Route path="/search/:query" component={Search}/>
                        </div>
                    </div>

                    <Player trackData={trackData} className="row"/>
                </div>



                <div id="darken" className="darken" onClick={hide}/>
                <div id="log" className="log">
                    <Route path="/signin" component={SignIn}/>
                    <Route path="/signup" component={SignUp}/>
                </div>

                <div id="darken" className="darken" onClick={hide}/>
                <div id="passwordChange" className="passwordChange">
                    <PasswordChange />
                </div>

                <div id="darken" className="darken" onClick={hide}/>
                <div id="addArtist" className="addArtist">
                    <AddArtist />
                </div>

                <div id="darken" className="darken" onClick={hide}/>
                <div id="addSong" className="addSong">
                    <AddSong />
                </div>

                <div id="darken" className="darken" onClick={hide}/>
                <div id="addAlbum" className="addAlbum">
                    <AddAlbum />
                </div>
            </Router>
        </div>
    );
}

export default withRouter(Apollo);