import firebaseApp from "./Firebase"
import firebase from "firebase";
import "firebase/auth";

const db = firebase.firestore(firebaseApp);

export async function isAdmin(uid){
    const res = await db.collection("admin").doc(uid).get();
    console.log(res.exists)
    return res.exists;
}

export const reauth = pass =>{
    const user = firebase.auth().currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(
        user.email,
        pass
    );

    return user.reauthenticateWithCredential(cred);
}