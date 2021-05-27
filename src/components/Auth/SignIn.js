import React, {useState} from 'react';
import {Form} from "semantic-ui-react";
import firebase from "../../utils/Firebase";
import {Link} from "react-router-dom";

export default function SignIn(){

    const [formData, setFormData] = useState(defaultValueForm)

    const onChange = e=>{
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        if(email != "" && password != ""){
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
        firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).then(()=>{
            console.log("Ok");
            document.getElementById("darken").style.display="none"
            document.getElementById("log").style.display="none";
            document.getElementById("err").style.display="none";
            window.location.href="/home";
        }).catch(()=>{console.log("ERR"); document.getElementById("err").style.display="block";})
    }


    return(
        <div className="logPage">
            <div className="head">
                <img src="https://tfgdaw.ddns.net/apollo/apollo-white.png" className="log-apollo" alt="apollo logo"/>
                <h2>APOLLO</h2>
                <h5>Sign In</h5>
            </div>
            <Form className="mail-input" onSubmit={onSubmit} onChange={onChange}>
                <p id="required" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold"}}>All fields are required</p>
                <input type="email" name="email" id="email" placeholder="Enter your email" className="email" required/>
                <input type="password" name="password" id="password" placeholder="Enter your password" className="pass" required/>
                <p id="err" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold"}}>Wrong user or password</p>
                <button type="submit" id="continue" className="continue" disabled>Sign In </button>
            </Form>
            <div>
                <p>Don't have an account? <Link className="signLink" to="/signup">Sign Up</Link></p>
            </div>
        </div>
    )
}


function defaultValueForm(){
    return {
        email: "",
        password:"",
    }
}