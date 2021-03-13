import firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'

export const firebaseApp = firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    appId: process.env.REACT_APP_APPID,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
})
export const firebaseAuthImport = firebase.auth
export const firebaseAuth = firebase.auth()
export const firebaseDb = firebaseApp.database()

if (firebase.messaging.isSupported()) {
    export const firebaseMessaging = firebase.messaging()
} else {
    alert('Browser not supported')
    export const firebaseMessaging = {}
}

export const firebaseAnalytics = firebase.analytics()

export const SERVER_TIMESTAMP = firebase.database.ServerValue.TIMESTAMP
