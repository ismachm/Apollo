import React, {useCallback, useEffect, useState} from "react";
import {Form, Image, Dropdown} from "semantic-ui-react";
import avatar from "../assets/user.png";
import firebase from "../utils/Firebase";
import "firebase/storage";
import "firebase/firestore";
import {v4 as uuidv4} from "uuid";
import {useDropzone} from "react-dropzone";
import add from "../assets/add.png";
import {map} from"lodash";

const db = firebase.firestore(firebase);

export default function AddAlbum(){

    const [formData, setFormData] = useState(defaultValueForm);
    const [coverUrl, setCoverUrl] = useState(null);
    const [file, setFile] = useState(null)
    const [albums, setAlbums] = useState([]);

    useEffect(()=>{
        db.collection("albums").get().then(res=>{
            const arrayAlbums = [];
            map(res.docs, album =>{
                const data = album.data();
                arrayAlbums.push({
                    key: album.id,
                    value: album.id,
                    text: data.tile
                });
            });
            setAlbums(arrayAlbums);
        });
    }, []);


    const uploadSong = fileName =>{
        const ref = firebase.storage().ref().child(`song/${fileName}`);
        return ref.put(file)
    };

    const onDrop = useCallback(acceptedFile => {
        setFile(acceptedFile[0]);
        let mime = acceptedFile[0].name.substring(acceptedFile[0].name.lastIndexOf(".")+1, acceptedFile[0].name.length)
        if(mime == "mp3"){
            document.getElementById("mimeErrArtist").style.display = "none"
            setCoverUrl(URL.createObjectURL(acceptedFile[0]));
        }
        else{
            document.getElementById("mimeErrSong").style.display = "block"
            setTimeout(()=>{
                document.getElementById("mimeErrSong").style.display = "none"
            }, 5000)
        }
    });

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        noKeyboard: true,
        onDrop
    });


    const onChange = (e, data)=>{
        let name = document.getElementById("songTitle").value;
        if(name != ""){
            document.getElementById("songContinue").disabled = false;
            document.getElementById("songRequired").style.display = "none";
        }
        else {
            document.getElementById("songContinue").disabled = true;
            document.getElementById("songRequired").style.display = "block";
        }
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

        console.log(formData)
    }

    const onSubmit = ()=> {
        const fileName = uuidv4();
        uploadSong(fileName).then(()=>{
            db.collection("songs").add({
                tile: formData.songTitle,
                album: formData.songAlbum,
                unique: fileName
            }).then(() => {
                console.log("song uploaded");
                setFormData(defaultValueForm());
                document.getElementById("songTitle").value = "";
                setCoverUrl(null);
                setFile(null)
                document.getElementById("darken").style.display = "none";
                document.getElementById("addSong").style.display = "none";
                setAlbums([]);
                window.location.href="/user"
            })
        })
    }

    return(
        <div className="logPage">
            <div className="head">
                <img src="https://tfgdaw.ddns.net/apollo/apollo-white.png" className="log-apollo" alt="apollo logo"/>
                <h2>APOLLO</h2>
                <h5>Add Song</h5>
            </div>
            <Form className="mail-input" onSubmit={onSubmit} onChange={onChange}>
                <div {...getRootProps()} className="albumCover">
                    <input {...getInputProps()}/>
                    <Image src={add} />
                    <p id="mimeErrAlbum" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold", transition: "all .5s ease-in-out"}}>File type not supported. Please try with JPG, JPEG, PNG or JFIF</p>
                    Upload here the file
                    {file && (
                        <p style={{fontSize : "12px"}}>File uploaded: {file.name}</p>
                    )}
                </div>
                <p id="songRequired" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold"}}>All fields are required</p>
                <input type="text" name="songTitle" id="songTitle" placeholder="Song's title" className="albumTitle" required/>
                <Dropdown className="albumDropdown" placeholder="Album" fluid selection  options={albums} lazyLoad onChange={(e, data) => setFormData({...formData, songAlbum: data.value})}/>
                <button type="submit" id="songContinue" className="continue" disabled>Add new song</button>
            </Form>
        </div>
    );
}

function defaultValueForm(){
    return {
        songTitle: "",
        songAlbum: "",
    }
}
