import React, {useCallback, useEffect, useState} from "react";
import {Form, Image, Dropdown} from "semantic-ui-react";
import avatar from "../assets/user.png";
import firebase from "../utils/Firebase";
import "firebase/storage";
import "firebase/firestore";
import {v4 as uuidv4} from "uuid";
import {useDropzone} from "react-dropzone";
import cover from "../assets/track.png";
import {map} from"lodash";

const db = firebase.firestore(firebase);

export default function AddAlbum(){

    const [formData, setFormData] = useState(defaultValueForm);
    const [coverUrl, setCoverUrl] = useState(null);
    const [file, setFile] = useState(null)
    const [artists, setArtists] = useState([]);

    useEffect(()=>{
        db.collection("artists").get().then(res=>{
            const arrayArtists = [];
            map(res.docs, artist =>{
                const data = artist.data();
                arrayArtists.push({
                    key: artist.id,
                    value: artist.id,
                    text: data.name
                });
            });
            setArtists(arrayArtists);
        });
    }, [formData]);

    const uploadImage = fileName =>{
        const ref = firebase.storage().ref().child(`album/${fileName}`);
        return ref.put(file)
    };

    const onDrop = useCallback(acceptedFile => {
        setFile(acceptedFile[0]);
        let mime = acceptedFile[0].name.substring(acceptedFile[0].name.lastIndexOf(".")+1, acceptedFile[0].name.length)
        if(mime == "jpg" || mime == "png" || mime == "jpeg" || mime == "jfif"){
            document.getElementById("mimeErrArtist").style.display = "none"
            setCoverUrl(URL.createObjectURL(acceptedFile[0]));
        }
        else{
            document.getElementById("mimeErrArtist").style.display = "block"
            setTimeout(()=>{
                document.getElementById("mimeErrArtist").style.display = "none"
            }, 5000)
        }
    });

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        noKeyboard: true,
        onDrop
    });

    const onChange = (e, data)=>{
        let name = document.getElementById("albumTitle").value;
        let year = document.getElementById("albumYear").value;
        let genre = document.getElementById("albumGenre").value;
        console.log(name + ", " + year + ", " + genre)
        if(name != "" && year != "" && genre != ""){
            document.getElementById("albumContinue").disabled = false;
            document.getElementById("albumRequired").style.display = "none";
        }
        else {
            document.getElementById("albumContinue").disabled = true;
            document.getElementById("albumRequired").style.display = "block";
        }
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

        console.log(formData)
    }

    const onSubmit = ()=> {
        const fileName = uuidv4();
        uploadImage(fileName).then(() => {
            console.log("Image uploaded successfully");
            db.collection("albums").add({
                tile: formData.albumTitle,
                year: formData.albumYear,
                genre: formData.albumGenre,
                artist: formData.albumArtist,
                unique: fileName
            }).then(() => {
                console.log("new album created");
                setFormData(defaultValueForm());
                document.getElementById("albumTitle").value = "";
                document.getElementById("albumYear").value = "";
                document.getElementById("albumGenre").value = "";
                setCoverUrl(null);
                document.getElementById("darken").style.display = "none";
                document.getElementById("addAlbum").style.display = "none";
                document.getElementById("mimeErrAlbum").style.display = "none";
            })
        })
    }

    return(
        <div className="logPage">
            <div className="head">
                <img src="https://tfgdaw.ddns.net/apollo/apollo-white.png" className="log-apollo" alt="apollo logo"/>
                <h2>APOLLO</h2>
                <h5>Add Album</h5>
            </div>
            <Form className="mail-input" onSubmit={onSubmit} onChange={onChange}>
                <div {...getRootProps()} className="albumCover">
                    <input {...getInputProps()}/>
                    {isDragActive ? (
                        <Image src={avatar}/>
                    ) : (
                        <Image className="albumsCover" src={coverUrl ? coverUrl : cover}/>
                    )}
                    <p id="mimeErrAlbum" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold", transition: "all .5s ease-in-out"}}>File type not supported. Please try with JPG, JPEG, PNG or JFIF</p>
                    Album's cover
                </div>

                <p id="albumRequired" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold"}}>All fields are required</p>
                <input type="text" name="albumTitle" id="albumTitle" placeholder="Album's title" className="albumTitle" required/>
                <input type="number" name="albumYear" id="albumYear" placeholder="Release year" className="albumYear" required/>
                <input type="text" name="albumGenre" id="albumGenre" placeholder="Album's genre" className="albumGenre" required/>
                <Dropdown className="albumDropdown" placeholder="Artist" fluid selection options={artists} lazyLoad onChange={(e, data) => setFormData({...formData, albumArtist: data.value})}/>
                <button type="submit" id="albumContinue" className="continue" disabled>Add new album</button>
            </Form>
        </div>
    );
}

function defaultValueForm(){
    return {
        albumTitle: "",
        albumYear: "",
        albumGenre: "",
        albumArtist: ""
    }
}
