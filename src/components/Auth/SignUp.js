import React, {useState} from 'react';
import {Form} from "semantic-ui-react";
import firebase from "../../utils/Firebase";
import "firebase/auth"
import {Link, Redirect} from 'react-router-dom'
import validateMail, {validateEmail} from "../../utils/Validations"

export default function SignUp(){

    const [formData, setFormData] = useState(defaultValueForm)
    const [isLoading, setIsLoading]  = useState(false);

    const onChange = e =>{
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let username = document.getElementById("username").value;
        if(email != "" && password != ""  && username != ""){
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
        console.log(formData)
        setIsLoading(true);

        if(!validateEmail(formData.email)){
            document.getElementById("validate").style.display = "block";
        }else document.getElementById("validate").style.display = "none";

        if(formData.password < 6){
            document.getElementById("chars").style.display= "block";
        }

        else{
            document.getElementById("used").style.display="none";
            document.getElementById("chars").style.display= "none";
            firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).then(()=>{
                changeUsername();
                console.log("Ok " + firebase.auth().currentUser.displayName);

                document.getElementById("log").style.display="none";
                document.getElementById("darken").style.display="none";
                document.getElementById("used").style.display="none";
                setTimeout(()=>{
                    window.location.href="/home"
                }, 1000);

            }).catch((error)=>{
                if (error.code =="auth/email-already-in-use"){
                    document.getElementById("used").style.display ="block";
                }}).finally(()=>{setIsLoading(false)})
        }
    }

    const changeUsername = ()=>{
        firebase.auth().currentUser.updateProfile({
            displayName: formData.username,
        }).catch(()=>{
            console.log("name asign err")}).finally(firebase.auth().currentUser.reload());
    }

    return(
        <div className="logPage">
            <div className="head">
                <img src="https://tfgdaw.ddns.net/apollo/apollo-white.png" className="log-apollo" alt="apollo logo"/>
                <h2>APOLLO</h2>
                <h5>Sign Up</h5>
            </div>
            <Form className="mail-input" onSubmit={onSubmit} onChange={onChange}>
                <p id="required" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold"}}>All fields are required</p>
                <p id="used" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold"}}>Email address already registered</p>
                <p id="validate" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold"}}>Enter a valid email address</p>
                <input type="email" name="email" id="email" placeholder="Enter your email" className="email" required/>
                <input type="password" name="password" id="password" placeholder="Enter your password" className="pass" required/>
                <p id="chars" style={{display: "none", color: "red", fontSize:"12px", fontWeight: "bold"}}>Password must contain at least 6 characters</p>
                <input type="text" name="username" id="username" placeholder="Enter your username" className="email" required/>
                <input type="submit" loading={{isLoading}} id="continue" value="Sign Up" className="continue" disabled/>
            </Form>
            <div>
                <p>Already have an account? <Link className="signLink" to="/signin">Sign In</Link></p>
            </div>
        </div>
    )
}

function defaultValueForm(){
    return {
        email: "",
        password:"",
        username:""
    }
}
