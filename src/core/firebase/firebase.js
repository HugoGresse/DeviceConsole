import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'
import { configFirebase } from '../../config/constants.js';

export const firebaseApp = firebase.initializeApp(configFirebase);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();
export const firebaseMessaging = firebase.messaging();
