import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AAAAAAAA",
  authDomain: "AAAAAAAA",
  projectId: "AAAAAAAA",
  storageBucket: "AAAAAAAA",
  messagingSenderId: "AAAAAAAA",
  appId: "AAAAAAAA",
  measurementId: "AAAAAAAA"
};

//Login with persistence
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
const analytics = getAnalytics(FIREBASE_APP);