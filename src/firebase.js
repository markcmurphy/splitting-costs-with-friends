import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyD3-RQry2xwkVQNO3JGxfO1xgl3Ru-dsNM",
  authDomain: "splitting-costs-with-friends.firebaseapp.com",
  databaseURL: "https://splitting-costs-with-friends.firebaseio.com",
  projectId: "splitting-costs-with-friends",
  storageBucket: "splitting-costs-with-friends.appspot.com",
  messagingSenderId: "72392180758",
  appId: "1:72392180758:web:f0d19e211d379aa8492137",
};

firebase.initializeApp(config);
const databaseRef = firebase.database().ref();
export const todosRef = databaseRef.child("todos");
