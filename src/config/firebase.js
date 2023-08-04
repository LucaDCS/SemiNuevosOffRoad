const firebase = require('firebase-admin');
const key = require('./SA.json');
let firebaseConfig = {
    credential: firebase.credential.cert(key),
	databaseURL: "https://seminuevosoffroad-default-rtdb.firebaseio.com/",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const dbRef = db.ref();


module.exports = {dbRef, db};