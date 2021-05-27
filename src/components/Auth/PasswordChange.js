import React,{useState} from "react";
import {Form} from "semantic-ui-react";
import {Link} from "react-router-dom";
import firebaseApp from "../../utils/Firebase";

import firebase from "../../utils/Firebase";
import "firebase/auth";
import {reauth} from "../../utils/Api";

export default function PasswordChange(){

    const [formData, setFormData] = useState(defaultValueForm)

    const onChange = e=>{
        let oldPassword = document.getElementById("oldPassword").value;
        let newPassword = document.getElementById("newPassword").value;
        document.getElementById("err").style.display="none";
        document.getElementById("changed").style.display = "none";
        document.getElementById("notChanged").style.display = "none";

        if(oldPassword != "" && newPassword != ""){
            document.getElementById("continue").disabled = false;
            document.getElementById("required").style.display = "none";
        }
        else {
            document.getElementById("continue").disabled = true;
            document.getElementById("required").style.display = "block";
        }

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }


    const onSubmit = ()=>{
        console.log(formData);

        if(formData.newPassword < 6){
            document.getElementById("chars").style.display= "block";
        }
        else{
            reauth(formData.oldPassword).then(()=>{
                console.log("Ok")
                const user = firebase.auth().currentUser;
                user.updatePassword(formData.newPassword).then(()=>{
                    document.getElementById("changed").style.display = "block";
                    setTimeout(()=>{
                        document.getElementById("darken").style.display = "none";
                        document.getElementById("passwordChange").style.display = "none";
                        document.getElementById("oldPassword").value = "";
                        document.getElementById("newPassword").value = "";
                        document.getElementById("err").style.display="none";
                        document.getElementById("changed").style.display = "none";
                        document.getElementById("notChanged").style.display = "none";
                    },  500)
                }).catch(()=>{document.getElementById("notChanged").style.display = "block";})
            }).catch(()=>{console.log("ERR"); document.getElementById("err").style.display="block";})
        }


    }


    return(
        <div className="logPage">
            <div className="head">
                <img src="https://tfgdaw.ddns.net/apollo/apollo-white.png" className="log-apollo" alt="apollo logo"/>
                <h2>APOLLO</h2>
                <h5>Change Password</h5>
            </div>
            <Form className="mail-input" onSubmit={onSubmit} onChange={onChange}>
                <p id="required" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold"}}>All fields are required</p>
                <input type="password" name="oldPassword" id="oldPassword" placeholder="Current password" className="pass" required/>
                <p id="err" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold"}}>Wrong password</p>
                <input type="password" name="newPassword" id="newPassword" placeholder="New password" className="pass" required/>
                <p id="chars" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold"}}>Password must contain at least 6 characters</p>
                <button type="submit" id="continue" className="continue" disabled>Change Password</button>
                <p id="changed" style={{display: "none", color: "green", fontSize:"12px", fontWeight: "bold"}}>Password changed successfully</p>
                <p id="notChanged" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold"}}>Password couldn't be changed</p>
            </Form>
        </div>
    )
}

function defaultValueForm(){
    return {
        oldPassword: "",
        newPassword:"",
    }
}