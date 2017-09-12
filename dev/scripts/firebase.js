import firebase from 'firebase';

  var config = {
    apiKey: "AIzaSyClK0VG-RTi5dzbQTvaWN5SXGW4XvZKvd0",
    authDomain: "waa-choop.firebaseapp.com",
    databaseURL: "https://waa-choop.firebaseio.com",
    projectId: "waa-choop",
    storageBucket: "",
    messagingSenderId: "450520540711"
  };
  firebase.initializeApp(config);

export default firebase;