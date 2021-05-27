import React, {useCallback, useState} from 'react';
import {Form, Image} from "semantic-ui-react";
import {useDropzone} from "react-dropzone";
import artistsAvatar from "../../assets/user.png";

export default function ArtistAvatar(props){

    const onDrop = useCallback(acceptedFile => {
        const file = acceptedFile[0];
        let mime = file.name.substring(file.name.lastIndexOf(".")+1, file.name.length)
        if(mime == "jpg" || mime == "png" || mime == "jpeg" || mime == "jfif"){
            document.getElementById("mimeErrArtist").style.display = "none";
            props.setAvatarUrl(file);
        }
        else{
            document.getElementById("mimeErrArtist").style.display = "block"
            setTimeout(()=>{
                document.getElementById("mimeErrArtist").style.display = "none"
            }, 5000)
        }
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        noKeyboard: true,
        onDrop
    })

    return(
        <Form.Field {...getRootProps()} className="artistAvatar" id="avatar">
            <input {...getInputProps()} />
            {isDragActive ? (
                <Image src={artistsAvatar}/>
            ) : (
                <Image className="artistsAvatar" src={props.avatarUrl ? URL.createObjectURL(props.avatarUrl) : artistsAvatar}/>
            )}
            Select artist's avatar
        </Form.Field>
    )
}