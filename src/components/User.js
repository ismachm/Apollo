import React, {useState, useCallback,  useEffect} from "react";
import firebase from "../utils/Firebase";
import "firebase/storage";
import "firebase/auth";
import {Link} from "react-router-dom";
import {Image} from "semantic-ui-react"
import {useDropzone} from "react-dropzone";
import avatar from "../assets/user.png";
import {isAdmin} from "../utils/Api";
import add from "../assets/add.png"
import {domContentLoaded} from "custom-electron-titlebar/lib/common/dom";

export default function User() {

    let user = firebase.auth().currentUser;

    const [avatarUrl, setAvatarUrl] = useState(user.photoURL);
    const [admin, setAdmin] = useState(false);
    let color ="";


    useEffect(()=>{
        isAdmin(user.uid).then( res =>{
            setAdmin(res);
        })
    }, [user])

    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    const logout = () => {
        firebase.auth().signOut();
        window.location.href = "/home";
    }

    const username = user.displayName;


    const onDrop = useCallback(acceptedFile => {
        const file = acceptedFile[0];
        console.log(file)
        let mime = acceptedFile[0].name.substring(acceptedFile[0].name.lastIndexOf(".")+1, acceptedFile[0].name.length)
        if(mime == "jpg" || mime == "png" || mime == "jpeg" || mime == "jfif"){
            document.getElementById("mimeErr").style.display = "none"
            setAvatarUrl(URL.createObjectURL(file));
            uploadImage(file).then(() => {
                updateUserAvatar();
            })
        }
        else{
            document.getElementById("mimeErr").style.display = "block"
            setTimeout(()=>{
                document.getElementById("mimeErr").style.display = "none"
            }, 5000)
        }
    })

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        noKeyboard: true,
        onDrop
    })

    const uploadImage = file => {
        const ref = firebase.storage().ref().child(`avatar/${user.uid}`);
        return ref.put(file);
    }

    const updateUserAvatar = () => {
        firebase.storage().ref(`avatar/${user.uid}`).getDownloadURL().then(response => {
            user.updateProfile({photoURL: response})
        })
    }


    function show(event) {
        document.getElementById("darken").style.display = "block";
        if(event.target.id == "updatePassword"){
            document.getElementById("passwordChange").style.display = "block";
        }else if(event.target.id == "addArtistBtn"){
            document.getElementById("addArtist").style.display = "block";
        }else if(event.target.id == "addSongBtn"){
            document.getElementById("addSong").style.display = "block";
        }
        else if(event.target.id == "addAlbumBtn"){
            document.getElementById("addAlbum").style.display = "block";
        }
    }


    let previousTheme = document.documentElement.style.getPropertyValue('--theme').substring(1, document.documentElement.style.getPropertyValue('--theme').length) ? document.documentElement.style.getPropertyValue('--theme').substring(1, document.documentElement.style.getPropertyValue('--theme').length) : "BEA8E2"

        function setColor(e){
        color = "#" + e.target.id;
        document.getElementById(previousTheme).style.filter = "brightness(100%)";
        document.getElementById(e.target.id).style.filter = "brightness(60%)";
        document.documentElement.style.setProperty('--theme', color)
        previousTheme = e.target.id;
    }

    return (
        <div id="user">
            <h1 className="pageTitle">Hi, {username}</h1>
            <div className="userContent row">
                <div className="user-avatar col-3" {...getRootProps()}>
                    <input {...getInputProps()}/>
                    {isDragActive ? (
                        <Image src={avatar}/>
                    ) : (
                        <Image className="avatar" src={avatarUrl ? avatarUrl : avatar}/>
                    )}
                    <p id="mimeErr" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold", transition: "all .5s ease-in-out"}}>File type not supported. Please try with JPG, JPEG, PNG or JFIF</p>
                    <Link className="logout" onClick={logout} to="/">Log Out</Link>
                </div>
                <div className="info col-6">
                    <div className="row">
                        <div className="displayMail col-12">
                            <p>Email</p>
                            <h3>{user.email}</h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="displayPass col-12">
                            <p>Password</p>
                            <h3 className="password">**** ******
                            <button className="updatePassword" id="updatePassword" onClick={show}>Update</button>
                            </h3>
                        </div>
                    </div>

                </div>
                {admin && (
                    <div className="add col-3">
                        <div className="row">
                            <div className="addArtists col-12">
                                <img src={add} id="addArtistBtn" onClick={show}/>
                                <h5>Add artist</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="addAlbums col-12">
                                <img src={add} id="addAlbumBtn" onClick={show}/>
                                <h5>Add album</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="addSongs col-12">
                                <img src={add} id="addSongBtn" onClick={show}/>
                                <h5>Add songs</h5>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="appTheme row">
                <div className="color blue col-2" id="70C8FF" onClick={setColor}  />
                <div className="color yellow col-2" id="FFCB70" onClick={setColor}/>
                <div className="color pink col-2" id="F098B3" onClick={setColor}  />
                <div className="color purple col-2" id="BEA8E2" onClick={setColor}/>
                <div className="color orange col-2" id="F89A75" onClick={setColor}/>
                <div className="color green col-2" id="66D397" onClick={setColor} />
            </div>
        </div>
    )
}