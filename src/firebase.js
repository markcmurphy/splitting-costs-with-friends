import * as firebase from "firebase";

const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
};

firebase.initializeApp(config);
export const databaseRef = firebase.database().ref();
export const friendsRef = databaseRef.child("friends");
// export const friendUpdateRef = firebase.database().ref("friends/" + friendId);

// export const findFriendsRef = firebase.database().ref("friends/" + friendId);

export const expensesRef = databaseRef.child("expenses");
export const totalsRef = databaseRef.child("totals");
