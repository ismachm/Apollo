import React, {useCallback, useState} from 'react';
import {Form, Image} from "semantic-ui-react";
import {useDropzone} from "react-dropzone";
import artistsBanner from "../../assets/banner.png";

export default function ArtistBanner(){

    const [bannerUrl, setBannerUrl] = useState(null);

    const onDrop = useCallback(acceptedFile => {
        const file = acceptedFile[0];
        let mime = file.name.substring(file.name.lastIndexOf(".")+1, file.name.length)
        if(mime == "jpg" || mime == "png" || mime == "jpeg" || mime == "jfif"){
            document.getElementById("mimeErrArtist").style.display = "none";
            setBannerUrl(URL.createObjectURL(file));
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
        <Form.Field {...getRootProps()} className="artistBanner" id="banner">
            <input {...getInputProps()} />
            {isDragActive ? (
                <Image src={artistsBanner}/>
            ) : (
                <Image className="artistsBanner" src={bannerUrl ? bannerUrl : artistsBanner}/>
            )}
            Select artist's banner
        </Form.Field>
    )
}