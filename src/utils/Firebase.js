import firebase from "firebase/app";

// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyCHVmFcvLsQpSzvqRSdC9qHpf_zNo2Bh3M",
    authDomain: "apollo-4ae61.firebaseapp.com",
    databaseURL: "https://apollo-4ae61-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "apollo-4ae61",
    storageBucket: "apollo-4ae61.appspot.com",
    messagingSenderId: "743522675905",
    appId: "1:743522675905:web:a0541cb788666fbba07840"
};
// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);
