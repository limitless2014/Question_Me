import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyBAoYhfX8_tjnoQX7yxQCf8p7EhcnKHx_Q",
    authDomain: "questionme-a7fdc.firebaseapp.com",
    databaseURL: "https://questionme-a7fdc.firebaseio.com",
    projectId: "questionme-a7fdc",
    storageBucket: "questionme-a7fdc.appspot.com",
    messagingSenderId: "1060035696998",
    appId: "1:1060035696998:web:ae8068f787eeb0b2"
  };

  firebase.initializeApp(firebaseConfig);

  export const f=firebase;
  export const database=firebase.database();
  export const auth=firebase.auth();
  export const storage=firebase.storage();
  