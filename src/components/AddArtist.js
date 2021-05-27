import React, {useCallback, useState} from 'react';
import {Form, Image} from "semantic-ui-react";
import firebase from "../utils/Firebase";
import "firebase/storage";
import "firebase/firestore";
import {v4 as uuidv4} from "uuid";
import {useDropzone} from "react-dropzone";
import avatar from "../assets/user.png";

const db = firebase.firestore(firebase);

export default function AddArtist(){

    const [formData, setFormData] = useState(defaultValueForm);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [file, setFile] = useState(null)


    const uploadImage = fileName =>{
        const ref = firebase.storage().ref().child(`artist/${fileName}`);
        return ref.put(file)
    };

    const onDrop = useCallback(acceptedFile => {
        setFile(acceptedFile[0]);
        let mime = acceptedFile[0].name.substring(acceptedFile[0].name.lastIndexOf(".")+1, acceptedFile[0].name.length)
        if(mime == "jpg" || mime == "png" || mime == "jpeg" || mime == "jfif"){
            document.getElementById("mimeErrArtist").style.display = "none"
            setAvatarUrl(URL.createObjectURL(acceptedFile[0]));
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


    const onChange = e=>{
        let name = document.getElementById("artistName").value;
        let info = document.getElementById("artistInfo").value;
        let genre = document.getElementById("artistGenre").value;
        if(name != "" && info != "" && genre != ""){
            document.getElementById("artistContinue").disabled = false;
            document.getElementById("artistRequired").style.display = "none";
        }
        else {
            document.getElementById("artistContinue").disabled = true;
            document.getElementById("artistRequired").style.display = "block";
        }
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

        console.log(formData)
    }

    const onSubmit = ()=>{
        const fileName = uuidv4();
        uploadImage(fileName).then(()=>{
            console.log("Image uploaded successfully");
            db.collection("artists").add({
                name:formData.artistName,
                info: formData.artistInfo,
                genre: formData.artistGenre,
                unique: fileName
            }).then(()=>{
                console.log("new artist created");
                setFormData(defaultValueForm());
                document.getElementById("artistName").value="";
                document.getElementById("artistInfo").value="";
                document.getElementById("artistGenre").value="";
                setAvatarUrl(null);
                document.getElementById("darken").style.display = "none";
                document.getElementById("addArtist").style.display = "none";
                document.getElementById("mimeErrArtist").style.display = "none";
            })
        })


    }

    return(
        <div className="logPage">
            <div className="head">
                <img src="https://tfgdaw.ddns.net/apollo/apollo-white.png" className="log-apollo" alt="apollo logo"/>
                <h2>APOLLO</h2>
                <h5>Add Artist</h5>
            </div>
            <Form className="mail-input" onSubmit={onSubmit} onChange={onChange}>
                <div {...getRootProps()} className="artistAvatar">
                    <input {...getInputProps()}/>
                    {isDragActive ? (
                        <Image src={avatar}/>
                    ) : (
                        <Image className="artistsAvatar" src={avatarUrl ? avatarUrl : avatar}/>
                    )}
                    <p id="mimeErrArtist" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold", transition: "all .5s ease-in-out"}}>File type not supported. Please try with JPG, JPEG, PNG or JFIF</p>
                    Artist's Avatar
                </div>

                <p id="artistRequired" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold"}}>All fields are required</p>
                <input type="text" name="artistName" id="artistName" placeholder="Artist's name" className="artistName" required/>
                <textarea name="artistInfo" id="artistInfo" placeholder="About the artist" className="artistInfo" required/>
                <input type="text" name="artistGenre" id="artistGenre" placeholder="Artist's genre" className="artistGenre" required/>
                <button type="submit" id="artistContinue" className="continue" disabled>Add new artist</button>
            </Form>
        </div>
    );
}

function defaultValueForm(){
    return {
        artistName: "",
        artistInfo: "",
        artistGenre: ""
    }
}
