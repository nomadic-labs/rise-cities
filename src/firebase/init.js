import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

const activeEnv = process.env.GATSBY_FIREBASE_ENVIRONMENT || process.env.NODE_ENV || "development"
const config = require(`../../config/firebase-config.${activeEnv}.json`)

let defaultFirebase = null;

console.log(`Using ${activeEnv} firebase configuration`)

if (!defaultFirebase) {
  defaultFirebase = firebase.initializeApp(config);
}

const firestore = firebase.firestore()

// const initAnalytics = async () => {
//   const analytics = await import("firebase/analytics")
// }

export default firebase;
export { firestore };
